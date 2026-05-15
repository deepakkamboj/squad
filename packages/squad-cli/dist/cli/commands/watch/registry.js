/**
 * Capability registry — stores and retrieves watch capabilities by name
 * and phase.
 */
export class CapabilityRegistry {
    capabilities = new Map();
    /** Register a capability. Overwrites if name already exists. */
    register(cap) {
        this.capabilities.set(cap.name, cap);
    }
    /** Get a capability by name. */
    get(name) {
        return this.capabilities.get(name);
    }
    /** Get all capabilities that run in a given phase, insertion-order. */
    getByPhase(phase) {
        return [...this.capabilities.values()].filter(c => c.phase === phase);
    }
    /** All registered capabilities. */
    all() {
        return [...this.capabilities.values()];
    }
    /** All registered capability names. */
    names() {
        return [...this.capabilities.keys()];
    }
}
//# sourceMappingURL=registry.js.map