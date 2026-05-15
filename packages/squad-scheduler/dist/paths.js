import { join } from 'node:path';
import { homedir } from 'node:os';
/** Resolved brand name — SQUAD_BRAND_NAME env var or "squad" fallback. */
function brandName() {
    return process.env['SQUAD_BRAND_NAME'] ?? 'squad';
}
/** Base directory for scheduler state. Respects SQUAD_SCHEDULER_HOME env var. */
export function schedulerHome() {
    if (process.env['SQUAD_SCHEDULER_HOME'])
        return process.env['SQUAD_SCHEDULER_HOME'];
    // e.g. ~/.pwagent/scheduler or ~/.squad/scheduler
    return join(homedir(), `.${brandName()}`, 'scheduler');
}
export function statePath() {
    return join(schedulerHome(), 'state.json');
}
export function pidPath() {
    return join(schedulerHome(), `${brandName()}-scheduler.pid`);
}
export function lockPath(jobId) {
    return join(schedulerHome(), 'locks', `${jobId}.lock`);
}
export function eventsPath(jobId) {
    return join(schedulerHome(), 'events', `${jobId}.jsonl`);
}
export function logPath(jobId) {
    return join(homedir(), `.${brandName()}`, 'logs', 'scheduler', `${jobId}.log`);
}
/** Resolve squad.schedule.json — cwd or SQUAD_SCHEDULE_FILE env var. */
export function configFilePath(cwd = process.cwd()) {
    return process.env['SQUAD_SCHEDULE_FILE'] ?? join(cwd, 'squad.schedule.json');
}
//# sourceMappingURL=paths.js.map