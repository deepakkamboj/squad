/**
 * Shared agent status rendering — single source of truth for /agents command and AgentPanel.
 *
 * Status enum: 'working' | 'streaming' | 'idle' | 'error'
 */
import { getRoleEmoji } from './lifecycle.js';
/** Canonical status tag for display in both TUI and text contexts. */
export function getStatusTag(status) {
    switch (status) {
        case 'working':
            return '[WORK]';
        case 'streaming':
            return '[STREAM]';
        case 'error':
            return '[ERR]';
        case 'idle':
            return '[IDLE]';
    }
}
/** Format a single agent line for plain-text output (used by /agents and /status commands). */
export function formatAgentLine(agent) {
    const emoji = getRoleEmoji(agent.role);
    const tag = getStatusTag(agent.status);
    return `  ${emoji} ${agent.name} ${tag} (${agent.role})`;
}
//# sourceMappingURL=agent-status.js.map