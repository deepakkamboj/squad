/**
 * Squad Start — PTY Mirror Mode
 *
 * `squad start [--tunnel]`
 * Spawns copilot in a PTY (pseudo-terminal) — you see the EXACT same
 * TUI as running copilot directly. The raw terminal output is mirrored
 * to a remote PWA via WebSocket + devtunnel.
 *
 * Bidirectional: keyboard input from terminal AND phone both go to copilot.
 */
export interface StartOptions {
    tunnel: boolean;
    port: number;
    copilotArgs?: string[];
    command?: string;
}
export declare function runStart(cwd: string, options: StartOptions): Promise<void>;
//# sourceMappingURL=start.d.ts.map