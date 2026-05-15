/**
 * squad preset — manage squad presets (curated agent collections)
 *
 * Presets are saved to SQUAD_HOME/presets/ (default: ~/.squad/presets/).
 * Each preset is a directory with a preset.json manifest + agents/ charters.
 *
 * Subcommands:
 *   squad preset list           — list available presets
 *   squad preset show <name>    — show preset details
 *   squad preset apply <name>   — install preset agents into current squad
 *   squad preset save <name>    — save current project agents as a preset
 *   squad preset init           — initialize presets directory in squad home
 *
 * Note: Presets capture agents only (charters). For full squad snapshots
 * including casting state, skills, and routing rules — e.g. to share a
 * configured squad or publish to an agent toolbox — use `squad export`.
 *
 * @module cli/commands/preset
 */
/**
 * Entry point for `squad preset` subcommands.
 */
export declare function runPreset(cwd: string, subcommand: string, args: string[]): Promise<void>;
//# sourceMappingURL=preset.d.ts.map