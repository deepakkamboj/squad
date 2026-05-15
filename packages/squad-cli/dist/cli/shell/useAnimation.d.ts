/**
 * Animation hooks for tasteful CLI transitions.
 *
 * All hooks respect NO_COLOR — when isNoColor() is true, animations are
 * skipped and static content is returned immediately.
 *
 * Frame rate capped at ~15fps (67ms intervals) to stay GPU-friendly in Ink.
 *
 * Owned by Cheritto (TUI Engineer).
 */
/**
 * Typewriter: reveals text character by character over durationMs.
 * NO_COLOR: returns full text immediately.
 */
export declare function useTypewriter(text: string, durationMs?: number): string;
/**
 * Fade-in: starts dim, becomes normal after durationMs.
 * Returns true while still fading (content should be dim).
 * Triggers when `active` becomes true.
 * NO_COLOR: always returns false (no fade).
 */
export declare function useFadeIn(active: boolean, durationMs?: number): boolean;
/**
 * Completion flash: detects when agents transition working/streaming → idle.
 * Returns Set of agent names currently showing "✓ Done" flash.
 * Flash lasts flashMs (default 1500ms).
 * NO_COLOR: returns empty set.
 *
 * Uses React's setState-during-render pattern for synchronous detection,
 * so the flash is visible on the same render that triggers the transition.
 */
export declare function useCompletionFlash(agents: Array<{
    name: string;
    status: string;
}>, flashMs?: number): Set<string>;
/**
 * Message fade: tracks new messages and returns count of "fading" messages
 * from the end of the visible list.
 * NO_COLOR: always returns 0.
 */
export declare function useMessageFade(totalCount: number, fadeMs?: number): number;
//# sourceMappingURL=useAnimation.d.ts.map