/**
 * WaveDispatch capability — parallel sub-task execution within issues.
 */
import type { WatchCapability, WatchContext, PreflightResult, CapabilityResult } from '../types.js';
export declare class WaveDispatchCapability implements WatchCapability {
    readonly name = "wave-dispatch";
    readonly description = "Wave-based parallel sub-task dispatch within issues";
    readonly configShape: "boolean";
    readonly requires: string[];
    readonly phase: "post-execute";
    preflight(_context: WatchContext): Promise<PreflightResult>;
    execute(context: WatchContext): Promise<CapabilityResult>;
}
//# sourceMappingURL=wave-dispatch.d.ts.map