/**
 * Capability registry — stores and retrieves watch capabilities by name
 * and phase.
 */
import type { WatchCapability, WatchPhase } from './types.js';
export declare class CapabilityRegistry {
    private capabilities;
    /** Register a capability. Overwrites if name already exists. */
    register(cap: WatchCapability): void;
    /** Get a capability by name. */
    get(name: string): WatchCapability | undefined;
    /** Get all capabilities that run in a given phase, insertion-order. */
    getByPhase(phase: WatchPhase): WatchCapability[];
    /** All registered capabilities. */
    all(): WatchCapability[];
    /** All registered capability names. */
    names(): string[];
}
//# sourceMappingURL=registry.d.ts.map