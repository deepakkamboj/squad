/**
 * squad externalize — move .squad/ state out of the working tree.
 *
 * Moves all squad state to `{resolveGlobalSquadPath()}/projects/{projectKey}/`
 * (platform-specific: `%APPDATA%/squad/` on Windows, `~/Library/Application Support/squad/`
 * on macOS, `$XDG_CONFIG_HOME/squad/` on Linux) and writes a thin `.squad/config.json`
 * marker in the repo. After externalization:
 * - State survives branch switches (not tied to the working tree)
 * - State is invisible to `git status` and never pollutes PRs
 * - A `.squad/config.json` marker lets the walk-up resolver find state
 *
 * To restore local state, run `squad internalize`.
 *
 * @module cli/commands/externalize
 */
/**
 * Move .squad/ state to the external directory.
 *
 * @param projectDir - Absolute path to the project root (where .squad/ lives).
 * @param projectKey - Optional explicit project key. Defaults to repo basename slug.
 */
export declare function runExternalize(projectDir: string, projectKey?: string): void;
/**
 * Move externalized state back into the working tree.
 */
export declare function runInternalize(projectDir: string): void;
//# sourceMappingURL=externalize.d.ts.map