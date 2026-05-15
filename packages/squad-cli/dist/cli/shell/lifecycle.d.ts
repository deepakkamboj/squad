/**
 * Shell session lifecycle management.
 *
 * Manages initialization (team discovery, path resolution),
 * message history tracking, state transitions, and graceful shutdown.
 *
 * @module cli/shell/lifecycle
 */
import { SessionRegistry } from './sessions.js';
import { ShellRenderer } from './render.js';
import type { ShellState, ShellMessage } from './types.js';
export interface LifecycleOptions {
    teamRoot: string;
    renderer: ShellRenderer;
    registry: SessionRegistry;
}
export interface DiscoveredAgent {
    name: string;
    role: string;
    charter: string | undefined;
    status: string;
}
/**
 * Manages the shell session lifecycle:
 * - Initialization (load team, resolve squad path, populate registry)
 * - Message handling (route user input, track responses)
 * - Cleanup (graceful shutdown, session cleanup)
 */
export declare class ShellLifecycle {
    private state;
    private options;
    private messageHistory;
    private discoveredAgents;
    constructor(options: LifecycleOptions);
    /**
     * Initialize the shell — verify .squad/, load team.md, discover agents.
     *
     * Reads via FSStorageProvider so all file access is routed through the
     * StorageProvider abstraction (Phase 3 migration).
     */
    initialize(): Promise<void>;
    /** Get current shell state. */
    getState(): ShellState;
    /** Get agents discovered during initialization. */
    getDiscoveredAgents(): readonly DiscoveredAgent[];
    /** Add a user message to history. */
    addUserMessage(content: string): ShellMessage;
    /** Add an agent response to history. */
    addAgentMessage(agentName: string, content: string): ShellMessage;
    /** Add a system message. */
    addSystemMessage(content: string): ShellMessage;
    /** Get message history (optionally filtered by agent). */
    getHistory(agentName?: string): ShellMessage[];
    /** Clean shutdown — close all sessions, clear state. */
    shutdown(): Promise<void>;
}
/** Role → emoji mapping for rich terminal display. */
export declare function getRoleEmoji(role: string): string;
export interface WelcomeData {
    projectName: string;
    description: string;
    agents: Array<{
        name: string;
        role: string;
        emoji: string;
    }>;
    focus: string | null;
    /** True on the very first launch after `squad init`. */
    isFirstRun: boolean;
}
/**
 * Load welcome screen data from .squad/ directory.
 *
 * Uses FSStorageProvider (sync) so all reads are routed through the
 * StorageProvider abstraction. Kept synchronous to preserve the React
 * useState initializer contract in App.tsx (Phase 3 migration).
 */
export declare function loadWelcomeData(teamRoot: string): WelcomeData | null;
//# sourceMappingURL=lifecycle.d.ts.map