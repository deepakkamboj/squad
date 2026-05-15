export interface TerminalCapabilities {
    supportsColor: boolean;
    supportsUnicode: boolean;
    columns: number;
    rows: number;
    platform: NodeJS.Platform;
    isWindows: boolean;
    isTTY: boolean;
    /** True when NO_COLOR=1, TERM=dumb, or color is otherwise suppressed. */
    noColor: boolean;
}
/** Current terminal width, clamped to a minimum of 40. */
export declare function getTerminalWidth(): number;
/** Current terminal height, clamped to a minimum of 10.
 *  Fallback of DEFAULT_TERMINAL_ROWS when rows is undefined (test/pipe environments)
 *  ensures the live viewport has enough room for content like /help. */
export declare function getTerminalHeight(): number;
/** React hook — returns live terminal width, updates on resize. */
export declare function useTerminalWidth(): number;
/** React hook — returns live terminal height, updates on resize. */
export declare function useTerminalHeight(): number;
/**
 * Returns true when the environment requests no color output.
 * Respects the NO_COLOR standard (https://no-color.org/) and TERM=dumb.
 */
export declare function isNoColor(): boolean;
/** Detect terminal capabilities for cross-platform compatibility. */
export declare function detectTerminal(): TerminalCapabilities;
/**
 * Get a safe character for the platform.
 * Falls back to ASCII on terminals that don't support unicode.
 */
export declare function safeChar(unicode: string, ascii: string, caps: TerminalCapabilities): string;
/**
 * Box-drawing characters that degrade gracefully.
 */
export declare function boxChars(caps: TerminalCapabilities): {
    tl: string;
    tr: string;
    bl: string;
    br: string;
    h: string;
    v: string;
};
/**
 * Terminal layout tier based on width.
 * - **wide** (120+ cols): Full layout — complete tables, full separators, all chrome
 * - **normal** (80-119 cols): Compact tables, shorter separators, abbreviated labels
 * - **narrow** (<80 cols): Card/stacked layout for tables, minimal chrome, no borders
 */
export type LayoutTier = 'wide' | 'normal' | 'narrow';
/** Determine layout tier from terminal width. */
export declare function getLayoutTier(width: number): LayoutTier;
/** React hook — returns current layout tier, updates on resize. */
export declare function useLayoutTier(): LayoutTier;
//# sourceMappingURL=terminal.d.ts.map