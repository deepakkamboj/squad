import React from 'react';
import { type ParsedInput } from '../router.js';
import type { SessionRegistry } from '../sessions.js';
import type { ShellRenderer } from '../render.js';
import type { ShellMessage } from '../types.js';
import type { SessionData } from '../session-store.js';
/** Methods exposed to the host so StreamBridge can push data into React state. */
export interface ShellApi {
    addMessage: (msg: ShellMessage) => void;
    clearMessages: () => void;
    setStreamingContent: (content: {
        agentName: string;
        content: string;
    } | null) => void;
    clearAgentStream: (agentName: string) => void;
    setActivityHint: (hint: string | undefined) => void;
    setAgentActivity: (agentName: string, activity: string | undefined) => void;
    setProcessing: (processing: boolean) => void;
    refreshAgents: () => void;
    refreshWelcome: () => void;
}
export interface AppProps {
    registry: SessionRegistry;
    renderer: ShellRenderer;
    teamRoot: string;
    version: string;
    /** Max messages to keep in visible history (default: 200). Older messages are archived. */
    maxMessages?: number;
    onReady?: (api: ShellApi) => void;
    onDispatch?: (parsed: ParsedInput) => Promise<void>;
    onCancel?: () => void;
    onRestoreSession?: (session: SessionData) => void;
}
export declare const App: React.FC<AppProps>;
//# sourceMappingURL=App.d.ts.map