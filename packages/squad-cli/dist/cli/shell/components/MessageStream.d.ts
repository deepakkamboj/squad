import React from 'react';
import { type LayoutTier } from '../terminal.js';
import type { ThinkingPhase } from './ThinkingIndicator.js';
import type { ShellMessage, AgentSession } from '../types.js';
/** Convert basic inline markdown to Ink <Text> elements. */
export declare function renderMarkdownInline(text: string): React.ReactNode;
interface MessageStreamProps {
    messages: ShellMessage[];
    agents?: AgentSession[];
    streamingContent?: Map<string, string>;
    processing?: boolean;
    activityHint?: string;
    agentActivities?: Map<string, string>;
    thinkingPhase?: ThinkingPhase;
    maxVisible?: number;
    /** When true, thinking indicator shows conversation-aware phrases. */
    hasConversation?: boolean;
}
/** Format elapsed seconds for response timestamps. */
export declare function formatDuration(start: Date, end: Date): string;
/**
 * Reformat markdown tables based on layout tier.
 * - **narrow**: Card layout (key-value pairs)
 * - **normal**: Truncate columns to fit maxWidth
 * - **wide**: Preserve full table
 */
export declare function wrapTableContent(content: string, maxWidth: number, tier: LayoutTier): string;
export declare const MessageStream: React.FC<MessageStreamProps>;
export {};
//# sourceMappingURL=MessageStream.d.ts.map