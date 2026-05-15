/**
 * Tracks child process PIDs spawned during watch rounds.
 * Enables cleanup of orphaned processes on exit or restart.
 */
export interface TrackedProcess {
    pid: number;
    name: string;
    spawnedAt: string;
}
export declare class PidTracker {
    private readonly pidFile;
    private tracked;
    constructor(teamRoot: string);
    /** Add a child PID to tracking. */
    track(pid: number, name: string): void;
    /** Remove a PID from tracking (process exited normally). */
    untrack(pid: number): void;
    /** Check if a process is still alive. */
    private isAlive;
    /** Kill a process tree. Cross-platform. */
    private killTree;
    /** Kill all tracked processes and clean up the PID file. */
    cleanup(): {
        killed: number;
        total: number;
    };
    /** On startup: check for stale PID file from a previous crashed run.
     *  Kill any orphans that are still alive. */
    cleanupStale(): number;
    /** Register process exit handlers for cleanup. */
    registerExitHandlers(): void;
    private save;
    private deletePidFile;
}
//# sourceMappingURL=pid-tracker.d.ts.map