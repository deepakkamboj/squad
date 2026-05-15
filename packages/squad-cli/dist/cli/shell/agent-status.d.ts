/**
 * Shared agent status rendering — single source of truth for /agents command and AgentPanel.
 *
 * Status enum: 'working' | 'streaming' | 'idle' | 'error'
 */
import type { AgentSession } from './types.js';
/** Canonical status tag for display in both TUI and text contexts. */
export declare function getStatusTag(status: AgentSession['status']): string;
/** Format a single agent line for plain-text output (used by /agents and /status commands). */
export declare function formatAgentLine(agent: AgentSession): string;
//# sourceMappingURL=agent-status.d.ts.map