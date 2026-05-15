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

/** Slash commands with descriptions for the suggestion box. */
const SLASH_COMMANDS_META: Suggestion[] = [
  { label: '/status',   description: 'show active agents and session info' },
  { label: '/agents',   description: 'list available agents' },
  { label: '/history',  description: 'browse conversation history' },
  { label: '/sessions', description: 'list saved sessions' },
  { label: '/resume',   description: 'restore a saved session' },
  { label: '/init',     description: 'broadcast a message to all agents' },
  { label: '/clear',    description: 'clear message history' },
  { label: '/version',  description: 'show version info' },
  { label: '/nap',      description: 'pause agents' },
  { label: '/help',     description: 'show help' },
  { label: '/quit',     description: 'exit' },
  { label: '/exit',     description: 'exit' },
];

export type CompleterResult = [string[], string];
export type CompleterFunction = (line: string) => CompleterResult;

/**
 * Return suggestions for the current input value.
 * Returns an empty array when there is nothing to suggest.
 */
export function getSuggestions(line: string, agents: AgentInfo[]): Suggestion[] {
  const trimmed = line.trimStart();

  if (trimmed.startsWith('@')) {
    const partial = trimmed.slice(1).toLowerCase();
    return agents
      .filter(a => a.name.toLowerCase().startsWith(partial))
      .map(a => ({ label: `@${a.name} `, description: a.description }));
  }

  if (trimmed.startsWith('/')) {
    const partial = trimmed.toLowerCase();
    return SLASH_COMMANDS_META.filter(s => s.label.startsWith(partial));
  }

  return [];
}

/**
 * Create a readline-compatible completer function (used for Tab cycling).
 * Completes @AgentName and /command prefixes.
 */
export function createCompleter(agents: AgentInfo[]): CompleterFunction {
  return (line: string): CompleterResult => {
    const suggestions = getSuggestions(line, agents);
    if (suggestions.length === 0) return [[], line];
    return [suggestions.map(s => s.label), line.trimStart()];
  };
}
