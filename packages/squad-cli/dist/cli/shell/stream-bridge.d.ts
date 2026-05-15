/**
 * Stream Bridge — connects StreamingPipeline events to shell rendering callbacks.
 *
 * Accumulates content deltas into complete messages and dispatches
 * to the shell's render loop via simple callbacks.
 *
 * @module cli/shell/stream-bridge
 */
import type { StreamingEvent } from '@bradygaster/squad-sdk/runtime/streaming';
import type { SessionRegistry } from './sessions.js';
import type { ShellMessage } from './types.js';
export interface StreamBridgeOptions {
    /** Callback when new content arrives (for render updates) */
    onContent: (agentName: string, content: string) => void;
    /** Callback when a message is complete */
    onComplete: (message: ShellMessage) => void;
    /** Callback for usage/cost data */
    onUsage?: (usage: {
        model: string;
        inputTokens: number;
        outputTokens: number;
        cost: number;
    }) => void;
    /** Callback for reasoning content */
    onReasoning?: (agentName: string, content: string) => void;
    /** Callback for errors */
    onError?: (agentName: string, error: Error) => void;
}
/**
 * Bridges the StreamingPipeline events to shell rendering callbacks.
 * Accumulates content deltas into complete messages.
 */
export declare class StreamBridge {
    private buffers;
    private readonly options;
    private readonly registry;
    /** Maximum buffer size per session (1 MB). Prevents unbounded memory growth. */
    static readonly MAX_BUFFER_SIZE: number;
    constructor(registry: SessionRegistry, options: StreamBridgeOptions);
    /**
     * Process a streaming event from the pipeline.
     * Dispatches to the correct callback based on event type.
     */
    handleEvent(event: StreamingEvent): void;
    /**
     * Finalize the buffer for a session, emitting a complete ShellMessage.
     * Call this when a stream ends (e.g. after the SDK signals completion).
     */
    flush(sessionId: string): void;
    /**
     * Get the current buffer content for a session (for partial renders).
     */
    getBuffer(sessionId: string): string;
    /**
     * Clear all buffers (on session end).
     */
    clear(): void;
    private handleDelta;
    private handleUsage;
    private handleReasoning;
}
//# sourceMappingURL=stream-bridge.d.ts.map