/**
 * Autocomplete for the Squad interactive shell.
 * Provides @agent name completion and /slash command completion.
 */
export interface Suggestion {
    /** The string inserted into the input when selected. */
    label: string;
    /** Short description shown to the right in the suggestion box. */
    description?: string;
}
/** Minimal agent metadata needed for suggestions. */
export interface AgentInfo {
    name: string;
    description?: string;
}
export type CompleterResult = [string[], string];
export type CompleterFunction = (line: string) => CompleterResult;
/**
 * Return suggestions for the current input value.
 * Returns an empty array when there is nothing to suggest.
 */
export declare function getSuggestions(line: string, agents: AgentInfo[]): Suggestion[];
/**
 * Create a readline-compatible completer function (used for Tab cycling).
 * Completes @AgentName and /command prefixes.
 */
export declare function createCompleter(agents: AgentInfo[]): CompleterFunction;
//# sourceMappingURL=autocomplete.d.ts.map