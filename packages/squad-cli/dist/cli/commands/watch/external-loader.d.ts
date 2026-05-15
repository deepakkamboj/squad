/**
 * External capability loader — scans .squad/capabilities/ for user-defined
 * WatchCapability modules and registers them alongside built-in capabilities.
 */
import type { CapabilityRegistry } from './registry.js';
/**
 * Load external WatchCapability modules from `{teamRoot}/.squad/capabilities/`.
 *
 * - Skips silently when the directory does not exist.
 * - Logs a warning and continues when a file fails to load.
 * - Returns the count of successfully loaded capabilities.
 */
export declare function loadExternalCapabilities(teamRoot: string, registry: CapabilityRegistry): Promise<number>;
//# sourceMappingURL=external-loader.d.ts.map