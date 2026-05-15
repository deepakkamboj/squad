import { readFileSync, writeFileSync, mkdirSync, existsSync, renameSync } from 'node:fs';
import { dirname } from 'node:path';
import type { SchedulerState, JobState } from './types.js';
import { statePath } from './paths.js';

const EMPTY: SchedulerState = { jobs: {}, updatedAt: new Date().toISOString() };

export function loadState(): SchedulerState {
  const p = statePath();
  if (!existsSync(p)) return structuredClone(EMPTY);
  try {
    return JSON.parse(readFileSync(p, 'utf8')) as SchedulerState;
  } catch {
    return structuredClone(EMPTY);
  }
}

export function saveState(state: SchedulerState): void {
  const p = statePath();
  mkdirSync(dirname(p), { recursive: true });
  state.updatedAt = new Date().toISOString();
  const tmp = p + '.tmp';
  writeFileSync(tmp, JSON.stringify(state, null, 2));
  renameSync(tmp, p); // atomic on same filesystem
}

export function getJobState(state: SchedulerState, jobId: string): JobState {
  return state.jobs[jobId] ?? { consecutiveFailures: 0 };
}

export function setJobState(state: SchedulerState, jobId: string, patch: Partial<JobState>): void {
  state.jobs[jobId] = { ...(state.jobs[jobId] ?? { consecutiveFailures: 0 }), ...patch };
}
