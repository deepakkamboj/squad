/**
 * Minimal 5-field cron parser and next-due calculator.
 * Format: minute hour day-of-month month day-of-week
 *
 * Supported syntax per field:
 *   *         any value
 *   n         exact value
 *   n-m       inclusive range
 *   n,m,o     comma list (values, ranges, or steps may be mixed)
 *   *\/n      step from 0 (or from range start)
 *   n-m\/n    step within range
 *
 * Day-of-week: 0 = Sunday … 6 = Saturday. Names: SUN MON TUE WED THU FRI SAT.
 * Month names: JAN FEB MAR APR MAY JUN JUL AUG SEP OCT NOV DEC.
 */
export interface ParsedCron {
    minutes: Set<number>;
    hours: Set<number>;
    doms: Set<number>;
    months: Set<number>;
    dows: Set<number>;
    raw: string;
}
export declare function parseCron(expr: string): ParsedCron;
/** Compute the next Date >= `after` that matches the cron expression. */
export declare function nextDue(cron: ParsedCron, after?: Date): Date;
/** Human-readable summary of a cron expression. */
export declare function describeCron(expr: string): string;
/** Validate a cron string, returning an error message or null if valid. */
export declare function validateCron(expr: string): string | null;
//# sourceMappingURL=cron.d.ts.map