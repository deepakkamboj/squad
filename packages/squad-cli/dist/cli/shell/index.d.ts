/**
 * Squad Interactive Shell — entry point
 *
 * Renders the Ink-based shell UI with AgentPanel, MessageStream, and InputPrompt.
 * Manages CopilotSDK sessions and routes messages to agents/coordinator.
 */
export { SessionRegistry } from './sessions.js';
export { StreamBridge } from './stream-bridge.js';
export type { StreamBridgeOptions } from './stream-bridge.js';
export { ShellRenderer } from './render.js';
export { ShellLifecycle } from './lifecycle.js';
export type { LifecycleOptions, DiscoveredAgent } from './lifecycle.js';
export { spawnAgent, loadAgentCharter, buildAgentPrompt } from './spawn.js';
export type { SpawnOptions, SpawnResult, ToolDefinition } from './spawn.js';
export { buildCoordinatorPrompt, buildInitModePrompt, parseCoordinatorResponse, formatConversationContext, hasRosterEntries } from './coordinator.js';
export type { CoordinatorConfig, RoutingDecision } from './coordinator.js';
export { parseInput, parseDispatchTargets } from './router.js';
export type { MessageType, ParsedInput, DispatchTargets } from './router.js';
export { executeCommand } from './commands.js';
export type { CommandContext, CommandResult } from './commands.js';
export { MemoryManager, DEFAULT_LIMITS } from './memory.js';
export type { MemoryLimits } from './memory.js';
export { detectTerminal, safeChar, boxChars } from './terminal.js';
export type { TerminalCapabilities } from './terminal.js';
export { createCompleter } from './autocomplete.js';
export type { CompleterFunction, CompleterResult } from './autocomplete.js';
export { createSession, saveSession, loadLatestSession, listSessions, loadSessionById } from './session-store.js';
export type { SessionData, SessionSummary } from './session-store.js';
export { App } from './components/App.js';
export type { ShellApi, AppProps } from './components/App.js';
export { ErrorBoundary } from './components/ErrorBoundary.js';
export { sdkDisconnectGuidance, teamConfigGuidance, agentSessionGuidance, genericGuidance, rateLimitGuidance, extractRetryAfter, timeoutGuidance, unknownCommandGuidance, formatGuidance, } from './error-messages.js';
export type { ErrorGuidance } from './error-messages.js';
export { enableShellMetrics, recordShellSessionDuration, recordAgentResponseLatency, recordShellError, isShellTelemetryEnabled, _resetShellMetrics, } from './shell-metrics.js';
/** Options for ghost response retry. */
export interface GhostRetryOptions {
    maxRetries?: number;
    backoffMs?: readonly number[];
    onRetry?: (attempt: number, maxRetries: number) => void;
    onExhausted?: (maxRetries: number) => void;
    debugLog?: (...args: unknown[]) => void;
    promptPreview?: string;
}
/**
 * Retry a send function when the response is empty (ghost response).
 * Ghost responses occur when session.idle fires before assistant.message,
 * causing sendAndWait() to return undefined or empty content.
 */
export declare function withGhostRetry(sendFn: () => Promise<string>, options?: GhostRetryOptions): Promise<string>;
export declare function runShell(): Promise<void>;
//# sourceMappingURL=index.d.ts.map