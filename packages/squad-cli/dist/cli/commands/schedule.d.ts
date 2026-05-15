/**
 * Schedule command — manage Squad scheduled tasks (#296)
 *
 * Subcommands:
 *   squad schedule list     — show configured schedules
 *   squad schedule run <id> — manually trigger a scheduled task
 *   squad schedule init     — create a default schedule.json
 *   squad schedule status   — show last run times and next due
 */
/**
 * Entry point for `squad schedule` subcommands.
 */
export declare function runSchedule(cwd: string, subcommand: string, args: string[]): Promise<void>;
//# sourceMappingURL=schedule.d.ts.map