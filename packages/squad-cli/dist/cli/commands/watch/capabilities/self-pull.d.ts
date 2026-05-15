/**
 * SelfPull capability — git stash + fetch + pull --ff-only + stash pop.
 *
 * Matches PS1 behavior: stashes local changes before pulling, pops after,
 * and warns if watch source files changed (restart recommended).
 */
import type { WatchCapability, WatchContext, PreflightResult, CapabilityResult } from '../types.js';
export declare class SelfPullCapability implements WatchCapability {
    readonly name = "self-pull";
    readonly description = "Git fetch/pull at round start to keep work-tree current";
    readonly configShape: "boolean";
    readonly requires: string[];
    readonly phase: "pre-scan";
    preflight(_context: WatchContext): Promise<PreflightResult>;
    execute(context: WatchContext): Promise<CapabilityResult>;
}
//# sourceMappingURL=self-pull.d.ts.map