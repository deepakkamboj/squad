/**
 * Verbose logger for squad watch debugging.
 * Only outputs when --verbose is enabled.
 */
export declare function createVerboseLogger(enabled: boolean): {
    log: (...args: unknown[]) => void;
    warn: (...args: unknown[]) => void;
    section: (title: string) => void;
    table: (data: Record<string, unknown>) => void;
};
export type VerboseLogger = ReturnType<typeof createVerboseLogger>;
//# sourceMappingURL=verbose.d.ts.map