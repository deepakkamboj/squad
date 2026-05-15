/**
 * Copilot agent CLI command — add/remove/auto-assign
 * Port from beta index.js lines 598-713
 */
export interface CopilotFlags {
    off?: boolean;
    autoAssign?: boolean;
}
/**
 * Run copilot command
 */
export declare function runCopilot(dest: string, flags: CopilotFlags): Promise<void>;
//# sourceMappingURL=copilot.d.ts.map