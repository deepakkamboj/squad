/**
 * Watch health check — reports status of a running watch instance.
 *
 * Reads the PID file (stored in OS temp dir) written at watch startup to
 * determine whether a watch process is alive, its uptime, auth account, and
 * whether auth has drifted since launch.
 */
/** Shape of the PID file written by runWatch at startup. */
export interface WatchPidInfo {
    pid: number;
    startedAt: string;
    user: string;
    interval: number;
    capabilities: string[];
    repo: string;
}
/**
 * Path to the PID file in the OS temp directory.
 * Uses an MD5 hash of the repo path so different clones/worktrees get
 * unique PID files without polluting the repo (avoids accidental commits).
 */
export declare function getPidPath(teamRoot: string): string;
/**
 * Write the PID file at watch startup.
 * The caller is responsible for registering exit handlers to clean up.
 */
export declare function writePidFile(teamRoot: string, info: WatchPidInfo): void;
/** Remove the PID file (best-effort, swallows errors). */
export declare function removePidFile(teamRoot: string): void;
/**
 * Check if a process with the given PID is still alive.
 * Uses `process.kill(pid, 0)` — signal 0 tests existence without killing.
 */
export declare function isProcessAlive(pid: number): boolean;
/**
 * Run the watch health check and return a formatted status string.
 *
 * @param teamRoot - The repository root (directory containing `.squad/`).
 */
export declare function getWatchHealth(teamRoot: string): string;
//# sourceMappingURL=health.d.ts.map