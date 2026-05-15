/**
 * Squad directory detection — zero dependencies
 */
export interface SquadDirInfo {
    path: string;
    name: '.squad' | '.ai-team';
    isLegacy: boolean;
}
/**
 * If `dir` has a `.git` worktree pointer file, parse it and return the
 * absolute path of the main checkout. Returns `null` otherwise.
 *
 * The `.git` file format is: `gitdir: <path-to-.git/worktrees/name>`
 */
export declare function resolveWorktreeMainCheckout(dir: string): string | null;
/**
 * Detect squad directory — .squad/ first, fall back to .ai-team/
 *
 * Worktree-aware: when neither directory exists at `dest`, checks if `dest`
 * is a git worktree and looks in the main checkout as a fallback.
 */
export declare function detectSquadDir(dest: string): SquadDirInfo;
//# sourceMappingURL=detect-squad-dir.d.ts.map