/** Base directory for scheduler state. Respects SQUAD_SCHEDULER_HOME env var. */
export declare function schedulerHome(): string;
export declare function statePath(): string;
export declare function pidPath(): string;
export declare function lockPath(jobId: string): string;
export declare function eventsPath(jobId: string): string;
export declare function logPath(jobId: string): string;
/** Resolve squad.schedule.json — cwd or SQUAD_SCHEDULE_FILE env var. */
export declare function configFilePath(cwd?: string): string;
//# sourceMappingURL=paths.d.ts.map