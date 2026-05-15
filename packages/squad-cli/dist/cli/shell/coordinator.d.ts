import type { ShellMessage } from './types.js';
/**
 * Check if team.md has actual roster entries in the ## Members section.
 * Returns true if there is at least one table data row.
 */
export declare function hasRosterEntries(teamContent: string): boolean;
export interface CoordinatorConfig {
    teamRoot: string;
    /** Path to routing.md */
    routingPath?: string;
    /** Path to team.md */
    teamPath?: string;
    /** When true, include the base roles catalog in the init prompt. Default: false (fictional universe casting). */
    useBaseRoles?: boolean;
}
/**
 * Build an Init Mode system prompt for team casting.
 * Used when team.md exists but has no roster entries.
 *
 * When `config.useBaseRoles` is true (opt-in via `--roles`), the prompt
 * includes the built-in base roles catalog so the LLM maps agents to
 * curated role IDs. Otherwise (default), the LLM casts from a fictional
 * universe with free-form role names — the beloved casting experience.
 */
export declare function buildInitModePrompt(config: CoordinatorConfig): string;
/**
 * Build the coordinator system prompt from team.md + routing.md.
 * This prompt tells the LLM how to route user requests to agents.
 *
 * Reads via FSStorageProvider so all file access is routed through the
 * StorageProvider abstraction (Phase 3 migration).
 */
export declare function buildCoordinatorPrompt(config: CoordinatorConfig): Promise<string>;
/**
 * Parse coordinator response to extract routing decisions.
 */
export interface RoutingDecision {
    type: 'direct' | 'route' | 'multi';
    directAnswer?: string;
    routes?: Array<{
        agent: string;
        task: string;
        context?: string;
    }>;
}
export declare function parseCoordinatorResponse(response: string): RoutingDecision;
/**
 * Format conversation history for the coordinator context window.
 * Keeps recent messages, summarizes older ones.
 */
export declare function formatConversationContext(messages: ShellMessage[], maxMessages?: number): string;
//# sourceMappingURL=coordinator.d.ts.map