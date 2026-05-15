/**
 * squad init --mode remote — remote mode variant of the init command.
 *
 * Creates .squad/ with config.json pointing to an external team root.
 * The standard init scaffolding still runs; this just adds the config link.
 *
 * Remote squad mode concept by @spboyer (Shayne Boyer), PR bradygaster/squad#131.
 *
 * @module cli/commands/init-remote
 */
/**
 * Write `.squad/config.json` for remote mode.
 *
 * @param projectDir - Project root (where .squad/ lives or will be created).
 * @param teamRepoPath - Absolute or relative path to the team repo.
 */
export declare function writeRemoteConfig(projectDir: string, teamRepoPath: string): void;
//# sourceMappingURL=init-remote.d.ts.map