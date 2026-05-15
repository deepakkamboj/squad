import { spawn } from 'node:child_process';
import { appendFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import type { SchedulerJob, DispatchResult } from './types.js';
import { logPath } from './paths.js';

function buildArgv(job: SchedulerJob): { cmd: string; args: string[]; shell: boolean } {
  const isWin = process.platform === 'win32';

  if (job.agent) {
    // Run via squad CLI: squad @agentName [args...]
    const agentArgs = job.args ? job.args.trim().split(/\s+/) : [];
    return {
      cmd: 'squad',
      args: [`@${job.agent}`, ...agentArgs],
      shell: isWin, // squad is a .cmd shim on Windows
    };
  }

  // Shell command
  const cmd = job.command!;
  return isWin
    ? { cmd: 'pwsh', args: ['-NonInteractive', '-Command', cmd], shell: false }
    : { cmd: 'sh', args: ['-c', cmd], shell: false };
}

export async function dispatch(job: SchedulerJob, runId: string): Promise<DispatchResult> {
  const maxMs = (job.maxRunSeconds ?? 600) * 1000;
  const logFile = logPath(job.id);
  mkdirSync(dirname(logFile), { recursive: true });

  const header = `\n--- ${job.name} | runId=${runId} | ${new Date().toISOString()} ---\n`;
  appendFileSync(logFile, header);

  const { cmd, args, shell } = buildArgv(job);
  const start = Date.now();

  return new Promise<DispatchResult>((resolve) => {
    const child = spawn(cmd, args, { shell, stdio: ['ignore', 'pipe', 'pipe'] });

    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGTERM');
      setTimeout(() => { try { child.kill('SIGKILL'); } catch {} }, 5000);
    }, maxMs);

    child.stdout?.on('data', (chunk: Buffer) => appendFileSync(logFile, chunk));
    child.stderr?.on('data', (chunk: Buffer) => appendFileSync(logFile, chunk));

    child.on('close', (code) => {
      clearTimeout(timer);
      const durationMs = Date.now() - start;
      const trailer = `--- exit=${code ?? -1} duration=${durationMs}ms timedOut=${timedOut} ---\n`;
      appendFileSync(logFile, trailer);
      resolve({ exitCode: code ?? -1, durationMs, timedOut });
    });

    child.on('error', (err) => {
      clearTimeout(timer);
      appendFileSync(logFile, `\n[spawn error] ${err.message}\n`);
      resolve({ exitCode: 127, durationMs: Date.now() - start, timedOut: false });
    });
  });
}
