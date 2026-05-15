/**
 * Backend migration — upgrades state backend from local to orphan or two-layer.
 *
 * Currently supports:
 * - local → orphan
 * - local → two-layer
 *
 * Migration from orphan/two-layer back to local is not supported (would require
 * materializing all state from the orphan branch back to the working tree).
 */
/**
 * Migrate the state backend for an existing squad project.
 * Only local → orphan/two-layer is supported.
 */
export declare function migrateStateBackend(dest: string, target: string): Promise<void>;
//# sourceMappingURL=migrate-backend.d.ts.map