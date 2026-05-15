/**
 * CLI command: squad subsquads
 *
 * Subcommands:
 *   list      — Show configured SubSquads
 *   status    — Show activity per SubSquad (branches, PRs)
 *   activate  — Write .squad-workstream file to activate a SubSquad
 */
/**
 * Entry point for `squad subsquads` subcommand.
 */
export declare function runSubSquads(cwd: string, args: string[]): Promise<void>;
/** @deprecated Use runSubSquads instead */
export declare const runWorkstreams: typeof runSubSquads;
/** @deprecated Use runSubSquads instead */
export declare const runStreams: typeof runSubSquads;
//# sourceMappingURL=streams.d.ts.map