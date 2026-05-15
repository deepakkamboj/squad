/**
 * Retro capability — enforce retrospective checks (Fridays or when missed).
 */
import type { WatchCapability, WatchContext, PreflightResult, CapabilityResult } from '../types.js';
export declare class RetroCapability implements WatchCapability {
    readonly name = "retro";
    readonly description = "Enforce retrospective checks (Fridays or when missed >7 days)";
    readonly configShape: "boolean";
    readonly requires: string[];
    readonly phase: "housekeeping";
    preflight(_context: WatchContext): Promise<PreflightResult>;
    execute(context: WatchContext): Promise<CapabilityResult>;
}
//# sourceMappingURL=retro.d.ts.map