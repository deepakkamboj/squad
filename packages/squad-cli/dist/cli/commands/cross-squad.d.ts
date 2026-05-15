/**
 * squad discover / squad delegate — CLI commands for cross-squad orchestration.
 *
 * Commands:
 *   squad discover                           — list known squads and capabilities
 *   squad delegate <squad-name> <description> — create work in another squad
 *
 * @module cli/commands/cross-squad
 */
export declare function discoverCommand(): Promise<void>;
export declare function delegateCommand(args: string[]): Promise<void>;
//# sourceMappingURL=cross-squad.d.ts.map