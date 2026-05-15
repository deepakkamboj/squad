/**
 * Cleanup capability — housekeeping for stale temp and log files.
 *
 * Runs in the 'housekeeping' phase. Clears the scratch directory, prunes
 * old orchestration-log and session-log entries, and warns about stale
 * decision inbox files.
 */
import type { WatchCapability, WatchContext, PreflightResult, CapabilityResult } from '../types.js';
export declare class CleanupCapability implements WatchCapability {
    readonly name = "cleanup";
    readonly description = "Remove stale scratch files, prune old logs, warn about stale inbox";
    readonly configShape: "object";
    readonly requires: string[];
    readonly phase: "housekeeping";
    preflight(context: WatchContext): Promise<PreflightResult>;
    execute(context: WatchContext): Promise<CapabilityResult>;
}
//# sourceMappingURL=cleanup.d.ts.map