/**
 * Console-based shell renderer.
 *
 * Renders agent output to the terminal using plain stdout writes.
 * This is the pre-ink renderer — will be replaced with ink components later.
 *
 * @module cli/shell/render
 */
export declare class ShellRenderer {
    private currentAgent;
    /** Print a content delta (streaming chunk). */
    renderDelta(agentName: string, content: string): void;
    /** Print a complete message. */
    renderMessage(role: string, name: string | undefined, content: string): void;
    /** Print a system message. */
    renderSystem(message: string): void;
    /** Print an error. */
    renderError(agentName: string, error: string): void;
    /** Print usage stats. */
    renderUsage(model: string, inputTokens: number, outputTokens: number, cost: number): void;
}
//# sourceMappingURL=render.d.ts.map