import { appendFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import type { SchedulerEvent, EventKind } from './types.js';
import { eventsPath } from './paths.js';

export function emitEvent(jobId: string, kind: EventKind, extra: Partial<SchedulerEvent> = {}): void {
  const event: SchedulerEvent = { ts: new Date().toISOString(), kind, jobId, ...extra };
  const p = eventsPath(jobId);
  try {
    mkdirSync(dirname(p), { recursive: true });
    appendFileSync(p, JSON.stringify(event) + '\n');
  } catch {
    // Best-effort — never crash the scheduler over a logging failure
  }
}

export function emitGlobal(kind: EventKind, message?: string): void {
  emitEvent('_scheduler', kind, { message });
}
