import { randomBytes } from 'node:crypto';
import type { SchedulerJob } from './types.js';
import { parseCron, nextDue } from './cron.js';
import { loadState, saveState, getJobState, setJobState } from './state.js';
import { dispatch } from './dispatcher.js';
import { emitEvent, emitGlobal } from './events.js';
import { acquireJobLock, releaseJobLock, acquireSchedulerLock, releaseSchedulerLock } from './lock.js';
import { loadConfig, watchConfig } from './loader.js';

const TICK_MS = 5_000; // check every 5 seconds

function runId(): string {
  return `${Date.now().toString(36)}-${randomBytes(3).toString('hex')}`;
}

async function runJob(job: SchedulerJob): Promise<void> {
  const rid = runId();
  const state = loadState();
  const js = getJobState(state, job.id);

  const maxSec = job.maxRunSeconds ?? 600;
  if (!acquireJobLock(job.id, maxSec)) {
    console.log(`[scheduler] ${job.id} already running — skipping`);
    return;
  }

  emitEvent(job.id, 'job_start', { runId: rid });
  console.log(`[scheduler] ▶ ${job.name} (${job.id}) run=${rid}`);

  const maxRetries = job.retryOnFailure ? (job.maxRetries ?? 2) : 0;
  const backoff = (job.retryBackoffSeconds ?? 30) * 1000;
  let result = { exitCode: 0, durationMs: 0, timedOut: false };

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (attempt > 0) {
      emitEvent(job.id, 'job_retry', { runId: rid, attempt });
      await new Promise(r => setTimeout(r, backoff));
    }
    result = await dispatch(job, rid);
    if (result.exitCode === 0) break;
  }

  releaseJobLock(job.id);

  const newFailures = result.exitCode === 0 ? 0 : js.consecutiveFailures + 1;
  const disableThreshold = job.disableAfterFailures ?? 5;
  const shouldDisable = newFailures >= disableThreshold;

  setJobState(state, job.id, {
    lastRunAt: new Date().toISOString(),
    nextDueAt: nextDue(parseCron(job.cron)).toISOString(),
    lastExitCode: result.exitCode,
    consecutiveFailures: newFailures,
    ...(shouldDisable ? { autoDisabled: true, autoDisabledAt: new Date().toISOString() } : {}),
  });
  saveState(state);

  if (result.timedOut) {
    emitEvent(job.id, 'job_timeout', { runId: rid, durationMs: result.durationMs });
    console.log(`[scheduler] ✗ ${job.id} timed out after ${result.durationMs}ms`);
  } else if (result.exitCode !== 0) {
    emitEvent(job.id, 'job_error', { runId: rid, exitCode: result.exitCode, durationMs: result.durationMs });
    console.log(`[scheduler] ✗ ${job.id} exit=${result.exitCode} (failures: ${newFailures})`);
  } else {
    emitEvent(job.id, 'job_end', { runId: rid, exitCode: 0, durationMs: result.durationMs });
    console.log(`[scheduler] ✓ ${job.id} done in ${result.durationMs}ms`);
  }

  if (shouldDisable) {
    emitEvent(job.id, 'job_auto_disabled', { runId: rid, message: `${newFailures} consecutive failures` });
    console.log(`[scheduler] ⚠ ${job.id} auto-disabled after ${newFailures} failures`);
  }
}

export async function startScheduler(cwd = process.cwd()): Promise<void> {
  const brandName = process.env['SQUAD_BRAND_NAME'] ?? 'squad';
  const brandUpper = process.env['SQUAD_BRAND_NAME_UPPER'] ?? brandName.toUpperCase();

  if (!acquireSchedulerLock()) {
    console.error(`[scheduler] another ${brandName} scheduler is already running`);
    process.exit(1);
  }

  let jobs = loadConfig(cwd);
  console.log(`[scheduler] ${brandUpper} scheduler started — ${jobs.length} job(s) loaded`);
  console.log(`[scheduler] config: ${process.env['SQUAD_SCHEDULE_FILE'] ?? `${cwd}/squad.schedule.json`}`);

  // Initialise nextDueAt for new jobs
  const state = loadState();
  for (const job of jobs) {
    if (job.enabled === false) continue;
    const js = getJobState(state, job.id);
    if (!js.nextDueAt) {
      setJobState(state, job.id, {
        nextDueAt: job.runOnStartup ? new Date().toISOString() : nextDue(parseCron(job.cron)).toISOString(),
        consecutiveFailures: 0,
      });
    }
  }
  saveState(state);

  // Watch config for hot-reload
  const stopWatch = watchConfig(cwd, (updated) => {
    jobs = updated;
    console.log(`[scheduler] config reloaded — ${jobs.length} job(s)`);
  });

  emitGlobal('scheduler_start');

  const stop = () => {
    emitGlobal('scheduler_stop');
    stopWatch();
    releaseSchedulerLock();
    console.log(`\n[scheduler] ${brand.name} scheduler stopped`);
    process.exit(0);
  };

  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);

  // Tick loop
  const running = new Set<string>();
  const tick = async () => {
    const now = new Date();
    const st = loadState();
    for (const job of jobs) {
      if (job.enabled === false) continue;
      const js = getJobState(st, job.id);
      if (js.autoDisabled) continue;
      if (running.has(job.id)) continue;
      const due = js.nextDueAt ? new Date(js.nextDueAt) : null;
      if (!due || now < due) continue;

      running.add(job.id);
      runJob(job).finally(() => running.delete(job.id));
    }
  };

  setInterval(() => { void tick(); }, TICK_MS);
  void tick(); // immediate first tick
}
