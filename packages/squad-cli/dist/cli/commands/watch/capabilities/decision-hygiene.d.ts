/**
 * DecisionHygiene capability — merge decision inbox when >5 files.
 */
import type { WatchCapability, WatchContext, PreflightResult, CapabilityResult } from '../types.js';
export declare class DecisionHygieneCapability implements WatchCapability {
    readonly name = "decision-hygiene";
    readonly description = "Auto-merge decision inbox when >5 files accumulate";
    readonly configShape: "boolean";
    readonly requires: string[];
    readonly phase: "housekeeping";
    preflight(context: WatchContext): Promise<PreflightResult>;
    execute(context: WatchContext): Promise<CapabilityResult>;
}
//# sourceMappingURL=decision-hygiene.d.ts.map