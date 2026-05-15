/**
 * squad build — compile TypeScript squad definitions into .squad/ markdown.
 *
 * Loads squad.config.ts (or squad/index.ts) and generates:
 *   - .squad/team.md
 *   - .squad/routing.md
 *   - .squad/agents/{name}/charter.md
 *   - .squad/ceremonies.md
 *
 * NEVER touches: decisions.md, history.md, orchestration-log/
 *
 * Flags:
 *   --check    validate without writing (exit 0 if matches disk, exit 1 if drift)
 *   --dry-run  show what would be generated without writing
 *   --watch    rebuild on .ts file changes (stub for now)
 *
 * @module cli/commands/build
 */
export interface BuildOptions {
    check?: boolean;
    dryRun?: boolean;
    watch?: boolean;
}
/**
 * Run the squad build pipeline.
 *
 * @param cwd - Project root directory
 * @param options - CLI flags
 */
export declare function runBuild(cwd: string, options?: BuildOptions): Promise<void>;
//# sourceMappingURL=build.d.ts.map