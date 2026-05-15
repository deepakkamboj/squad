import { appendFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { eventsPath } from './paths.js';
export function emitEvent(jobId, kind, extra = {}) {
    const event = { ts: new Date().toISOString(), kind, jobId, ...extra };
    const p = eventsPath(jobId);
    try {
        mkdirSync(dirname(p), { recursive: true });
        appendFileSync(p, JSON.stringify(event) + '\n');
    }
    catch {
        // Best-effort — never crash the scheduler over a logging failure
    }
}
export function emitGlobal(kind, message) {
    emitEvent('_scheduler', kind, { message });
}
//# sourceMappingURL=events.js.map