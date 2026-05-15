/** Acquire per-job lock. Returns true if acquired, false if already held. */
export declare function acquireJobLock(jobId: string, maxRunSeconds: number): boolean;
export declare function releaseJobLock(jobId: string): void;
/** Write the scheduler process PID file. Returns false if another instance is running. */
export declare function acquireSchedulerLock(): boolean;
export declare function releaseSchedulerLock(): void;
//# sourceMappingURL=lock.d.ts.map