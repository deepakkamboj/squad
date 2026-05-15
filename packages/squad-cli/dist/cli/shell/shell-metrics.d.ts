/**
 * Shell Observability Metrics (Issues #508, #520, #526, #530, #531)
 *
 * Provides user-facing shell metrics: session lifetime, agent response
 * latency (time to first visible token), error rate, and session count.
 * No-op when SQUAD_TELEMETRY !== '1' or OTel is not configured.
 *
 * Privacy-first: opt-in via SQUAD_TELEMETRY=1 env var. No PII collected.
 *
 * @module shell/shell-metrics
 */
/** Check if shell telemetry is opt-in enabled via SQUAD_TELEMETRY=1. */
export declare function isShellTelemetryEnabled(): boolean;
/**
 * Enable shell metrics collection. Call once at shell startup.
 * Always enabled when OTel is configured; SQUAD_TELEMETRY=1 also enables.
 * Returns true if metrics were enabled.
 */
export declare function enableShellMetrics(): boolean;
/** Record the final session duration when the shell exits. */
export declare function recordShellSessionDuration(durationMs: number): void;
/**
 * Record agent response latency — time from message dispatch to first
 * visible response token. Attributes include agent name and dispatch type.
 */
export declare function recordAgentResponseLatency(agentName: string, latencyMs: number, dispatchType?: 'direct' | 'coordinator'): void;
/**
 * Record an error encountered during the shell session.
 * Attributes include error source context.
 */
export declare function recordShellError(source: string, errorType?: string): void;
/** Reset all cached metric instances and state. Used in tests only. */
export declare function _resetShellMetrics(): void;
//# sourceMappingURL=shell-metrics.d.ts.map