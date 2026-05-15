/**
 * Squad Sync — synchronizes squad-state branches and git notes with a remote.
 *
 * Used directly (`squad sync`) or invoked by git hooks (pre-push, post-merge, post-rewrite).
 * Handles both orphan and two-layer backends transparently.
 *
 * Design:
 * - Fetches remote squad-state branch(es) and fast-forwards local refs
 * - Pushes local squad-state branch(es) to remote
 * - For two-layer, also syncs refs/notes/squad* namespaces
 * - Uses fast-forward-only semantics to avoid data loss on divergence
 * - Recursion guard via SQUAD_SYNC_ACTIVE env var
 */
export interface SyncOptions {
    direction: 'push' | 'pull' | 'both';
    remote?: string;
    cwd?: string;
    quiet?: boolean;
}
/**
 * Main sync entrypoint.
 */
export declare function runSync(options: SyncOptions): Promise<void>;
//# sourceMappingURL=sync.d.ts.map