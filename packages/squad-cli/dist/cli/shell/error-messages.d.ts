/**
 * User-friendly error message templates with recovery guidance.
 * All messages are conversational and action-oriented.
 *
 * @module cli/shell/error-messages
 */
export interface ErrorGuidance {
    message: string;
    recovery: string[];
}
/** SDK disconnect / connection errors */
export declare function sdkDisconnectGuidance(detail?: string): ErrorGuidance;
/** team.md missing or invalid */
export declare function teamConfigGuidance(issue: string): ErrorGuidance;
/** Agent session failure */
export declare function agentSessionGuidance(agentName: string, detail?: string): ErrorGuidance;
/**
 * Extract retry-after duration (in seconds) from an error message string.
 * Handles patterns like "retry after 120 seconds", "try again in 2 hours", etc.
 */
export declare function extractRetryAfter(message: string): number | undefined;
/** Rate limit hit — model or endpoint temporarily throttled */
export declare function rateLimitGuidance(opts?: {
    retryAfter?: number;
    model?: string;
}): ErrorGuidance;
/** Generic error with context */
export declare function genericGuidance(detail: string): ErrorGuidance;
/** Request timeout */
export declare function timeoutGuidance(agentName?: string): ErrorGuidance;
/** Unknown slash command */
export declare function unknownCommandGuidance(command: string): ErrorGuidance;
/** Format an ErrorGuidance into a user-facing string */
export declare function formatGuidance(g: ErrorGuidance): string;
//# sourceMappingURL=error-messages.d.ts.map