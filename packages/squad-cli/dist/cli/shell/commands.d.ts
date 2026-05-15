import { SessionRegistry } from './sessions.js';
import { ShellRenderer } from './render.js';
import { type SessionData } from './session-store.js';
import type { ShellMessage } from './types.js';
export interface CommandContext {
    registry: SessionRegistry;
    renderer: ShellRenderer;
    messageHistory: ShellMessage[];
    teamRoot: string;
    version?: string;
    /** Callback to restore a previous session's messages into the shell. */
    onRestoreSession?: (session: SessionData) => void;
}
export interface CommandResult {
    handled: boolean;
    exit?: boolean;
    output?: string;
    /** When true, the shell should clear its message history. */
    clear?: boolean;
    /** When true, the shell should trigger init casting with the provided prompt. */
    triggerInitCast?: {
        prompt: string;
    };
    /**
     * When true, the shell should enter "awaiting init prompt" mode:
     * the next user message will be treated as a team-cast request.
     * Set when `/init` is run with no inline prompt.
     */
    awaitInitPrompt?: boolean;
}
/**
 * Execute a slash command.
 */
export declare function executeCommand(command: string, args: string[], context: CommandContext): CommandResult;
//# sourceMappingURL=commands.d.ts.map