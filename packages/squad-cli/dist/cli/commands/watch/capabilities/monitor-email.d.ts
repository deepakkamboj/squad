/**
 * MonitorEmail capability — scan email for actionable items + GitHub alerts.
 */
import type { WatchCapability, WatchContext, PreflightResult, CapabilityResult } from '../types.js';
export declare class MonitorEmailCapability implements WatchCapability {
    readonly name = "monitor-email";
    readonly description = "Scan email for actionable items each round (requires WorkIQ MCP)";
    readonly configShape: "boolean";
    readonly requires: string[];
    readonly phase: "housekeeping";
    preflight(_context: WatchContext): Promise<PreflightResult>;
    execute(context: WatchContext): Promise<CapabilityResult>;
}
//# sourceMappingURL=monitor-email.d.ts.map