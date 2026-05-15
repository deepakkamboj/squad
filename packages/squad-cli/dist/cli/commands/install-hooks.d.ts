/**
 * Git Hook Installation — installs squad sync hooks into the repo's .git/hooks/.
 *
 * Hooks are installed with chaining: if a user already has a hook (e.g., from husky),
 * the squad hook is appended and the existing hook is called first.
 *
 * Installed hooks:
 * - pre-push: pushes squad-state branches alongside the user's push
 * - post-merge: fetches squad-state after the user pulls
 * - post-rewrite: fetches squad-state after rebase
 * - post-checkout: fetches squad-state on branch switch
 */
export interface InstallHooksOptions {
    force?: boolean;
}
/**
 * Main hook installation entrypoint.
 */
export declare function installGitHooks(cwd: string, options?: InstallHooksOptions): void;
/**
 * Ensure hooks are installed if the backend requires them.
 * Called by `squad upgrade` to silently ensure hooks exist for orphan/two-layer repos.
 * Does not print anything if hooks are already installed or backend doesn't need them.
 */
export declare function ensureHooksForBackend(cwd: string): void;
//# sourceMappingURL=install-hooks.d.ts.map