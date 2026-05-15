/**
 * Agent spawning — loads charters, builds prompts, and manages spawn lifecycle.
 *
 * Creates SDK sessions via SquadClient, sends the task, and streams the response.
 */
import { SquadClient } from '@bradygaster/squad-sdk/client';
import { SessionRegistry } from './sessions.js';
export interface SpawnOptions {
    /** Wait for completion (sync) or fire-and-track (background) */
    mode: 'sync' | 'background';
    /** Additional system prompt context */
    systemContext?: string;
    /** Tool definitions to register */
    tools?: ToolDefinition[];
    /** SquadClient instance for SDK session creation */
    client?: SquadClient;
    /** Working directory for the session */
    teamRoot?: string;
}
export interface ToolDefinition {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
}
export interface SpawnResult {
    agentName: string;
    status: 'completed' | 'streaming' | 'error';
    response?: string;
    error?: string;
}
/**
 * Load agent charter from .squad/agents/{name}/charter.md
 *
 * Reads via SquadState → AgentHandle.charter() so all file access is
 * routed through the StorageProvider abstraction.
 */
export declare function loadAgentCharter(agentName: string, teamRoot?: string): Promise<string>;
/**
 * Build system prompt for an agent from their charter + optional context
 */
export declare function buildAgentPrompt(charter: string, options?: {
    systemContext?: string;
}): string;
/**
 * Spawn an agent session.
 *
 * When a SquadClient is provided via options.client, creates a real SDK session,
 * sends the task, streams the response, and returns the accumulated result.
 * Without a client, returns a stub result for backward compatibility.
 */
export declare function spawnAgent(name: string, task: string, registry: SessionRegistry, options?: SpawnOptions): Promise<SpawnResult>;
//# sourceMappingURL=spawn.d.ts.map