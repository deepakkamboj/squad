import { readFileSync, writeFileSync, unlinkSync, mkdirSync, existsSync } from 'node:fs';
import { dirname } from 'node:path';
import { lockPath, pidPath } from './paths.js';
function isPidAlive(pid) {
    try {
        process.kill(pid, 0);
        return true;
    }
    catch {
        return false;
    }
}
/** Acquire per-job lock. Returns true if acquired, false if already held. */
export function acquireJobLock(jobId, maxRunSeconds) {
    const p = lockPath(jobId);
    mkdirSync(dirname(p), { recursive: true });
    if (existsSync(p)) {
        try {
            const data = JSON.parse(readFileSync(p, 'utf8'));
            const age = (Date.now() - new Date(data.acquiredAt).getTime()) / 1000;
            if (isPidAlive(data.pid) && age < maxRunSeconds * 1.5)
                return false;
            // Stale lock — remove and proceed
            unlinkSync(p);
        }
        catch {
            unlinkSync(p);
        }
    }
    writeFileSync(p, JSON.stringify({ pid: process.pid, acquiredAt: new Date().toISOString(), jobId }));
    return true;
}
export function releaseJobLock(jobId) {
    try {
        unlinkSync(lockPath(jobId));
    }
    catch { /* already gone */ }
}
/** Write the scheduler process PID file. Returns false if another instance is running. */
export function acquireSchedulerLock() {
    const p = pidPath();
    mkdirSync(dirname(p), { recursive: true });
    if (existsSync(p)) {
        try {
            const data = JSON.parse(readFileSync(p, 'utf8'));
            if (isPidAlive(data.pid))
                return false;
        }
        catch { /* stale */ }
    }
    writeFileSync(p, JSON.stringify({ pid: process.pid, acquiredAt: new Date().toISOString() }));
    return true;
}
export function releaseSchedulerLock() {
    try {
        unlinkSync(pidPath());
    }
    catch { /* already gone */ }
}
//# sourceMappingURL=lock.js.map