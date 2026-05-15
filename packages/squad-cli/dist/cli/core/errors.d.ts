/**
 * Error handling utilities — zero dependencies
 */
/**
 * Error class for fatal CLI errors.
 * CLI entry points catch these and call process.exit(1).
 * Library consumers can catch the SquadError normally.
 */
export declare class SquadError extends Error {
    constructor(message: string);
}
/**
 * Throw a fatal error. In CLI context, the entry point catches and exits.
 * In library context, callers can catch the SquadError normally.
 */
export declare function fatal(msg: string): never;
//# sourceMappingURL=errors.d.ts.map