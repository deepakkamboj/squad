import { platform } from 'node:os';
import { useState, useEffect } from 'react';
/** Current terminal width, clamped to a minimum of 40. */
export function getTerminalWidth() {
    return Math.max(process.stdout.columns || 80, 40);
}
/**
 * Default row count used when `process.stdout.rows` is undefined
 * (e.g. piped output, test harnesses). 50 rows ensures the live
 * viewport has enough room for content like /help.
 */
const DEFAULT_TERMINAL_ROWS = 50;
/** Current terminal height, clamped to a minimum of 10.
 *  Fallback of DEFAULT_TERMINAL_ROWS when rows is undefined (test/pipe environments)
 *  ensures the live viewport has enough room for content like /help. */
export function getTerminalHeight() {
    return Math.max(process.stdout.rows || DEFAULT_TERMINAL_ROWS, 10);
}
/**
 * Shared hook that subscribes to `process.stdout` resize events and
 * returns the current value of `getter()`, debounced at 150 ms.
 * Extracted from the formerly-duplicated useTerminalWidth / useTerminalHeight hooks.
 */
function useTerminalDimension(getter) {
    const [value, setValue] = useState(getter());
    useEffect(() => {
        let timer = null;
        const onResize = () => {
            if (timer)
                clearTimeout(timer);
            timer = setTimeout(() => setValue(getter()), 150);
        };
        const prev = process.stdout.getMaxListeners?.() ?? 10;
        if (prev <= 20)
            process.stdout.setMaxListeners?.(prev + 10);
        process.stdout.on('resize', onResize);
        return () => {
            process.stdout.off('resize', onResize);
            if (timer)
                clearTimeout(timer);
        };
    }, []);
    return value;
}
/** React hook — returns live terminal width, updates on resize. */
export function useTerminalWidth() { return useTerminalDimension(getTerminalWidth); }
/** React hook — returns live terminal height, updates on resize. */
export function useTerminalHeight() { return useTerminalDimension(getTerminalHeight); }
/**
 * Returns true when the environment requests no color output.
 * Respects the NO_COLOR standard (https://no-color.org/) and TERM=dumb.
 */
export function isNoColor() {
    return (process.env['NO_COLOR'] != null && process.env['NO_COLOR'] !== '' ||
        process.env['TERM'] === 'dumb');
}
/** Detect terminal capabilities for cross-platform compatibility. */
export function detectTerminal() {
    const plat = platform();
    const isTTY = Boolean(process.stdout.isTTY);
    const noColor = isNoColor();
    return {
        supportsColor: !noColor && isTTY && (process.env['FORCE_COLOR'] !== '0'),
        supportsUnicode: plat !== 'win32' || Boolean(process.env['WT_SESSION']),
        columns: process.stdout.columns || 80,
        // detectTerminal uses 24 (standard VT100 default) rather than
        // DEFAULT_TERMINAL_ROWS because this is a capability snapshot — not
        // a live viewport sizing decision — and 24 is the safer assumption
        // when advertising rows to callers that need a conservative baseline.
        rows: process.stdout.rows || 24,
        platform: plat,
        isWindows: plat === 'win32',
        isTTY,
        noColor,
    };
}
/**
 * Get a safe character for the platform.
 * Falls back to ASCII on terminals that don't support unicode.
 */
export function safeChar(unicode, ascii, caps) {
    return caps.supportsUnicode ? unicode : ascii;
}
/**
 * Box-drawing characters that degrade gracefully.
 */
export function boxChars(caps) {
    if (caps.supportsUnicode) {
        return { tl: '╭', tr: '╮', bl: '╰', br: '╯', h: '─', v: '│' };
    }
    return { tl: '+', tr: '+', bl: '+', br: '+', h: '-', v: '|' };
}
/** Determine layout tier from terminal width. */
export function getLayoutTier(width) {
    if (width >= 120)
        return 'wide';
    if (width >= 80)
        return 'normal';
    return 'narrow';
}
/** React hook — returns current layout tier, updates on resize. */
export function useLayoutTier() {
    const width = useTerminalWidth();
    return getLayoutTier(width);
}
//# sourceMappingURL=terminal.js.map