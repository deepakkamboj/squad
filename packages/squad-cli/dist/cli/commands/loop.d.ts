/**
 * Loop command — prompt-driven continuous work loop.
 *
 * Reads a loop.md file (YAML frontmatter + prompt body) and runs it on a
 * fixed interval without requiring GitHub issues.  Think of it as Ralph in
 * "free-run" mode: the prompt IS the work driver.
 */
export interface LoopFrontmatter {
    /**
     * Onboarding-mode switch, not a safety gate.
     * - `configured: false` (or missing) → run the onboarding flow
     * - `configured: true` → run the normal loop flow
     * Do not reintroduce an early-return guard based on this flag.
     */
    configured: boolean;
    /** Minutes between cycles (default: 10). */
    interval: number;
    /** Max minutes per cycle (default: 30). */
    timeout: number;
    /** Human description shown in status output. */
    description?: string;
}
export interface LoopConfig {
    /** Path to loop file (default: loop.md in cwd). */
    filePath?: string;
    /** Override interval from frontmatter. */
    interval?: number;
    /** Override timeout from frontmatter. */
    timeout?: number;
    /** Extra flags passed to `gh copilot`. */
    copilotFlags?: string;
    /** Fully override the agent command (e.g., `gh copilot --yolo`). */
    agentCmd?: string;
    /** Capability overrides, keyed by capability name. */
    capabilities: Record<string, boolean | Record<string, unknown>>;
}
/**
 * Parse a loop.md string into validated frontmatter + prompt body.
 *
 * Frontmatter is the YAML block between the first two `---` delimiters.
 * Only simple `key: value` pairs are supported — no yaml dependency needed.
 */
export declare function parseLoopFile(content: string): {
    frontmatter: LoopFrontmatter;
    prompt: string;
};
/** Returns the content of a starter loop.md for --init. */
export declare function generateLoopFile(): string;
/**
 * Run the loop command.
 *
 * @param dest     - Working directory (typically process.cwd()).
 * @param options  - CLI-parsed config overrides.
 */
export declare function runLoop(dest: string, options: LoopConfig): Promise<void>;
//# sourceMappingURL=loop.d.ts.map