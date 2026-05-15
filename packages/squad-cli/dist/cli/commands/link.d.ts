/**
 * squad link <team-repo-path> — link a project to a remote team root.
 *
 * Writes `.squad/config.json` with a relative `teamRoot` path so the
 * dual-root resolver (resolveSquadPaths) can find the team identity dir.
 *
 * Remote squad mode concept by @spboyer (Shayne Boyer), PR bradygaster/squad#131.
 *
 * @module cli/commands/link
 */
/**
 * Link the current project to a remote team root.
 *
 * @param projectDir - Project root (cwd or explicit).
 * @param teamRepoPath - Path (relative or absolute) to the team repo.
 */
export declare function runLink(projectDir: string, teamRepoPath: string): void;
//# sourceMappingURL=link.d.ts.map