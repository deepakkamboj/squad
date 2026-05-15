import { join } from 'node:path';
import { homedir } from 'node:os';

/** Resolved brand name — SQUAD_BRAND_NAME env var or "squad" fallback. */
function brandName(): string {
  return process.env['SQUAD_BRAND_NAME'] ?? 'squad';
}

/** Base directory for scheduler state. Respects SQUAD_SCHEDULER_HOME env var. */
export function schedulerHome(): string {
  if (process.env['SQUAD_SCHEDULER_HOME']) return process.env['SQUAD_SCHEDULER_HOME'];
  // e.g. ~/.pwagent/scheduler or ~/.squad/scheduler
  return join(homedir(), `.${brandName()}`, 'scheduler');
}

export function statePath(): string {
  return join(schedulerHome(), 'state.json');
}

export function pidPath(): string {
  return join(schedulerHome(), `${brandName()}-scheduler.pid`);
}

export function lockPath(jobId: string): string {
  return join(schedulerHome(), 'locks', `${jobId}.lock`);
}

export function eventsPath(jobId: string): string {
  return join(schedulerHome(), 'events', `${jobId}.jsonl`);
}

export function logPath(jobId: string): string {
  return join(homedir(), `.${brandName()}`, 'logs', 'scheduler', `${jobId}.log`);
}

/** Resolve squad.schedule.json — cwd or SQUAD_SCHEDULE_FILE env var. */
export function configFilePath(cwd = process.cwd()): string {
  return process.env['SQUAD_SCHEDULE_FILE'] ?? join(cwd, 'squad.schedule.json');
}
