/**
 * FleetDispatch capability — batches read-heavy issues into a single
 * `/fleet`-style parallel Copilot session for efficient triage.
 *
 * Runs in the `post-execute` phase.  When `dispatchMode` is `'fleet'` or
 * `'hybrid'`, this capability picks up issues classified as read-heavy
 * (research, review, audit, etc.) and dispatches them as parallel
 * analysis tracks inside one Copilot invocation.
 */
import type { WatchCapability, WatchContext, PreflightResult, CapabilityResult } from '../types.js';
export declare class FleetDispatchCapability implements WatchCapability {
    readonly name = "fleet-dispatch";
    readonly description = "Batch read-heavy issues into a parallel /fleet Copilot session";
    readonly configShape: "boolean";
    readonly requires: string[];
    readonly phase: "post-execute";
    preflight(_context: WatchContext): Promise<PreflightResult>;
    execute(context: WatchContext): Promise<CapabilityResult>;
}
//# sourceMappingURL=fleet-dispatch.d.ts.map