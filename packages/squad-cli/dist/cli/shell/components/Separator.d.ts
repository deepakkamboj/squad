/**
 * Separator — shared horizontal rule component.
 *
 * Consolidates all inline separator rendering (AgentPanel, MessageStream, App.tsx)
 * into a single reusable component. Uses box-drawing chars that degrade to ASCII.
 *
 * Owned by Cheritto (TUI Engineer).
 */
import React from 'react';
export interface SeparatorProps {
    /** Explicit character width. Defaults to min(terminalWidth, 80) - 2. */
    width?: number;
    marginTop?: number;
    marginBottom?: number;
}
export declare const Separator: React.FC<SeparatorProps>;
//# sourceMappingURL=Separator.d.ts.map