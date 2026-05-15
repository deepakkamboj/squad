import { readFileSync, writeFileSync, mkdirSync, existsSync, renameSync } from 'node:fs';
import { dirname } from 'node:path';
import { statePath } from './paths.js';
const EMPTY = { jobs: {}, updatedAt: new Date().toISOString() };
export function loadState() {
    const p = statePath();
    if (!existsSync(p))
        return structuredClone(EMPTY);
    try {
        return JSON.parse(readFileSync(p, 'utf8'));
    }
    catch {
        return structuredClone(EMPTY);
    }
}
export function saveState(state) {
    const p = statePath();
    mkdirSync(dirname(p), { recursive: true });
    state.updatedAt = new Date().toISOString();
    const tmp = p + '.tmp';
    writeFileSync(tmp, JSON.stringify(state, null, 2));
    renameSync(tmp, p); // atomic on same filesystem
}
export function getJobState(state, jobId) {
    return state.jobs[jobId] ?? { consecutiveFailures: 0 };
}
export function setJobState(state, jobId, patch) {
    state.jobs[jobId] = { ...(state.jobs[jobId] ?? { consecutiveFailures: 0 }), ...patch };
}
//# sourceMappingURL=state.js.map