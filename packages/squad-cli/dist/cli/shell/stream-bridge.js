/**
 * Stream Bridge — connects StreamingPipeline events to shell rendering callbacks.
 *
 * Accumulates content deltas into complete messages and dispatches
 * to the shell's render loop via simple callbacks.
 *
 * @module cli/shell/stream-bridge
 */
/**
 * Bridges the StreamingPipeline events to shell rendering callbacks.
 * Accumulates content deltas into complete messages.
 */
export class StreamBridge {
    buffers = new Map();
    options;
    registry;
    /** Maximum buffer size per session (1 MB). Prevents unbounded memory growth. */
    static MAX_BUFFER_SIZE = 1024 * 1024;
    constructor(registry, options) {
        this.registry = registry;
        this.options = options;
    }
    /**
     * Process a streaming event from the pipeline.
     * Dispatches to the correct callback based on event type.
     */
    handleEvent(event) {
        switch (event.type) {
            case 'message_delta':
                this.handleDelta(event);
                break;
            case 'usage':
                this.handleUsage(event);
                break;
            case 'reasoning_delta':
                this.handleReasoning(event);
                break;
        }
    }
    /**
     * Finalize the buffer for a session, emitting a complete ShellMessage.
     * Call this when a stream ends (e.g. after the SDK signals completion).
     */
    flush(sessionId) {
        const content = this.buffers.get(sessionId);
        if (content === undefined || content.length === 0)
            return;
        const session = this.registry.get(sessionId);
        const agentName = session?.name ?? sessionId;
        const message = {
            role: 'agent',
            agentName,
            content,
            timestamp: new Date(),
        };
        this.options.onComplete(message);
        this.buffers.delete(sessionId);
        this.registry.updateStatus(sessionId, 'idle');
    }
    /**
     * Get the current buffer content for a session (for partial renders).
     */
    getBuffer(sessionId) {
        return this.buffers.get(sessionId) ?? '';
    }
    /**
     * Clear all buffers (on session end).
     */
    clear() {
        this.buffers.clear();
    }
    // ---------- Private ----------
    handleDelta(event) {
        const { sessionId, content } = event;
        const agentName = event.agentName ?? sessionId;
        // Accumulate content in the session buffer (with size limit)
        const existing = this.buffers.get(sessionId) ?? '';
        const updated = existing + content;
        if (updated.length <= StreamBridge.MAX_BUFFER_SIZE) {
            this.buffers.set(sessionId, updated);
        }
        else {
            // Truncate from the front to keep the most recent content
            this.buffers.set(sessionId, updated.slice(-StreamBridge.MAX_BUFFER_SIZE));
        }
        // Mark session as streaming
        this.registry.updateStatus(agentName, 'streaming');
        // Notify the render loop
        this.options.onContent(agentName, content);
    }
    handleUsage(event) {
        const agentName = event.agentName ?? event.sessionId;
        this.options.onUsage?.({
            model: event.model,
            inputTokens: event.inputTokens,
            outputTokens: event.outputTokens,
            cost: event.estimatedCost,
        });
        // Usage event typically signals end of a turn — mark idle
        this.registry.updateStatus(agentName, 'idle');
    }
    handleReasoning(event) {
        const agentName = event.agentName ?? event.sessionId;
        this.options.onReasoning?.(agentName, event.content);
    }
}
//# sourceMappingURL=stream-bridge.js.map