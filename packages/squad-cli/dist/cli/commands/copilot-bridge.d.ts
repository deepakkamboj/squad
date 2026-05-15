/**
 * Squad Remote Control — Copilot ACP Bridge
 *
 * Spawns `copilot --acp --stdio` and relays JSON-RPC messages
 * between the WebSocket clients and the Copilot CLI process.
 */
export interface CopilotBridgeConfig {
    cwd: string;
    agent?: string;
}
export declare class CopilotBridge {
    private config;
    private child;
    private messageCallback;
    private requestId;
    private pendingRequests;
    private sessionId;
    private initialized;
    constructor(config: CopilotBridgeConfig);
    /** Check if copilot CLI supports ACP stdio mode */
    static checkCompatibility(): Promise<{
        compatible: boolean;
        version: string;
        message: string;
    }>;
    /** Set callback for messages from Copilot */
    onMessage(cb: (line: string) => void): void;
    /** Spawn copilot --acp --stdio */
    start(): Promise<void>;
    /** Send raw NDJSON line to copilot stdin */
    send(message: string): void;
    /** Send JSON-RPC request and wait for response */
    private sendRequest;
    /** Initialize ACP protocol + create session */
    private initialize;
    /** Send a prompt to Copilot (response comes via notifications) */
    sendPrompt(text: string): void;
    /** Stop the copilot process */
    stop(): void;
    isRunning(): boolean;
}
//# sourceMappingURL=copilot-bridge.d.ts.map