/**
 * TwoPass capability — lightweight list then hydrate actionable issues only.
 */
import type { WatchCapability, WatchContext, PreflightResult, CapabilityResult } from '../types.js';
export declare class TwoPassCapability implements WatchCapability {
    readonly name = "two-pass";
    readonly description = "Lightweight scan then hydrate only actionable issues";
    readonly configShape: "boolean";
    readonly requires: string[];
    readonly phase: "post-triage";
    preflight(_context: WatchContext): Promise<PreflightResult>;
    execute(context: WatchContext): Promise<CapabilityResult>;
}
//# sourceMappingURL=two-pass.d.ts.map