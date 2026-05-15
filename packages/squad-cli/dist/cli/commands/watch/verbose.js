/**
 * Verbose logger for squad watch debugging.
 * Only outputs when --verbose is enabled.
 */
export function createVerboseLogger(enabled) {
    return {
        log: (...args) => {
            if (enabled)
                console.log('[verbose]', ...args);
        },
        warn: (...args) => {
            if (enabled)
                console.log('[verbose] ⚠️', ...args);
        },
        section: (title) => {
            if (enabled)
                console.log(`[verbose] ── ${title} ──`);
        },
        table: (data) => {
            if (enabled) {
                for (const [k, v] of Object.entries(data)) {
                    console.log(`[verbose]   ${k}: ${v}`);
                }
            }
        },
    };
}
//# sourceMappingURL=verbose.js.map