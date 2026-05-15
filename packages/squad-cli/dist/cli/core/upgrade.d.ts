/**
 * Squad upgrade command — overwrites squad-owned files, runs migrations
 * Zero-dep implementation using Node.js stdlib only
 * @module cli/core/upgrade
 */
export interface UpgradeOptions {
    migrateDirectory?: boolean;
    self?: boolean;
    force?: boolean;
    /** When --self, install the insider (prerelease) tag instead of latest. */
    insider?: boolean;
}
export interface UpdateInfo {
    fromVersion: string;
    toVersion: string;
    filesUpdated: string[];
    migrationsRun: string[];
}
/**
 * Ensure .gitattributes has required merge=union rules (idempotent)
 */
export declare function ensureGitattributes(dest: string): string[];
/**
 * Ensure .gitignore has required entries (idempotent).
 * Skips entries already covered by a parent path (e.g. `.squad/` covers `.squad/log/`).
 */
export declare function ensureGitignore(dest: string): string[];
/**
 * Create missing infrastructure directories
 */
export declare function ensureDirectories(dest: string): string[];
/**
 * Scaffold default casting files (registry.json, policy.json, history.json)
 * if they don't already exist. Sources content from shipped templates when
 * available, falling back to inline JSON defaults.
 */
export declare function ensureCastingDefaults(dest: string, templatesDir?: string): string[];
/**
 * Run the upgrade command
 */
export declare function runUpgrade(dest: string, options?: UpgradeOptions): Promise<UpdateInfo>;
export interface SelfUpgradeOptions {
    insider?: boolean;
    force?: boolean;
}
/**
 * Self-upgrade the Squad CLI package via the detected package manager.
 *
 * Detects whether the CLI was installed via npm, pnpm, or yarn and runs the
 * appropriate global install command. On EACCES errors, suggests `sudo` with
 * the detected installer name.
 */
export declare function selfUpgradeCli(options?: SelfUpgradeOptions): Promise<void>;
//# sourceMappingURL=upgrade.d.ts.map