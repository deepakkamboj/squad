/**
 * MonitorTeams capability — scan Teams for actionable messages via WorkIQ.
 */
import type { WatchCapability, WatchContext, PreflightResult, CapabilityResult } from '../types.js';
export declare class MonitorTeamsCapability implements WatchCapability {
    readonly name = "monitor-teams";
    readonly description = "Scan Teams for actionable messages each round (requires WorkIQ MCP)";
    readonly configShape: "boolean";
    readonly requires: string[];
    readonly phase: "housekeeping";
    preflight(_context: WatchContext): Promise<PreflightResult>;
    execute(context: WatchContext): Promise<CapabilityResult>;
}
//# sourceMappingURL=monitor-teams.d.ts.map