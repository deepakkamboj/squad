export type MessageType = 'slash_command' | 'direct_agent' | 'coordinator';
export interface ParsedInput {
    type: MessageType;
    raw: string;
    command?: string;
    args?: string[];
    agentName?: string;
    content?: string;
    skipCastConfirmation?: boolean;
}
/**
 * Parse user input to determine routing.
 * - /command → slash command
 * - @AgentName message → direct to agent
 * - anything else → coordinator
 */
export declare function parseInput(input: string, knownAgents: string[]): ParsedInput;
/** Result of extracting multiple @agent mentions from a message. */
export interface DispatchTargets {
    agents: string[];
    content: string;
}
/**
 * Extract multiple @agent mentions from a message for parallel dispatch.
 * Returns all matched agent names (de-duplicated, case-insensitive) and
 * the remaining message content with mentions stripped out.
 *
 * Examples:
 *   "@Fenster @Hockney fix and test" → { agents: ['Fenster','Hockney'], content: 'fix and test' }
 *   "plain message" → { agents: [], content: 'plain message' }
 */
export declare function parseDispatchTargets(input: string, knownAgents: string[]): DispatchTargets;
//# sourceMappingURL=router.d.ts.map