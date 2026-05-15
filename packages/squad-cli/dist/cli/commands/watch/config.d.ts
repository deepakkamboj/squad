/**
 * Watch config loader.
 *
 * Priority: CLI flag > .squad/config.json "watch" section > defaults.
 */
import type { SquadStateContext, StateBackendType } from '@bradygaster/squad-sdk';
/** Dispatch strategy for issue execution. */
export type DispatchMode = 'task' | 'fleet' | 'hybrid';
/** Fully-resolved watch configuration. */
export interface WatchConfig {
    interval: number;
    execute: boolean;
    maxConcurrent: number;
    timeout: number;
    copilotFlags?: string;
    /** Hidden — fully override the agent command. */
    agentCmd?: string;
    /** Dispatch mode: 'task' (default 1:1), 'fleet' (batch read-only), 'hybrid' (auto-classify). */
    dispatchMode?: DispatchMode;
    /** Optional path to a log file. When set, console output is tee'd to the file with timestamps. */
    logFile?: string;
    /** Per-capability config: `true` / `false` / object with sub-options. */
    capabilities: Record<string, boolean | Record<string, unknown>>;
    /** Enable verbose diagnostic output for debugging. */
    verbose?: boolean;
    /** Preferred auth user for platform operations (e.g. gh auth switch --user). */
    authUser?: string;
    /** Notification level for watch events. */
    notifyLevel?: 'all' | 'important' | 'none';
    /** Hour to begin overnight mode (e.g. "22:00"). */
    overnightStart?: string;
    /** Hour to end overnight mode (e.g. "08:00"). */
    overnightEnd?: string;
    /** Path to a sentinel file — watch shuts down gracefully when removed. */
    sentinelFile?: string;
    /** State persistence backend. */
    stateBackend?: StateBackendType;
    /** Pre-resolved state context from CLI entry (avoids redundant resolution). */
    stateContext?: SquadStateContext | null;
}
/**
 * Load watch config from `.squad/config.json` then merge CLI overrides.
 *
 * @param teamRoot   - Root directory containing `.squad/`.
 * @param cliOverrides - Values from CLI flag parsing (only set keys win).
 */
export declare function loadWatchConfig(teamRoot: string, cliOverrides: Partial<WatchConfig>): WatchConfig;
//# sourceMappingURL=config.d.ts.map