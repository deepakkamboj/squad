/**
 * Extract an agent name from a task description string.
 * Tries multiple patterns in order of specificity:
 *   1. Emoji + name + colon at start (e.g. "🔧 EECOM: Fix auth module")
 *   2. Name + colon anywhere (e.g. "EECOM: Fix auth module")
 *   3. Fuzzy: any knownAgentName appears as a whole word (case-insensitive)
 *
 * @param description - The task description string
 * @param knownAgentNames - Lowercase agent names to match against
 * @returns Parsed agent name and task summary, or null if no match
 */
export declare function parseAgentFromDescription(description: string, knownAgentNames: string[]): {
    agentName: string;
    taskSummary: string;
} | null;
//# sourceMappingURL=agent-name-parser.d.ts.map