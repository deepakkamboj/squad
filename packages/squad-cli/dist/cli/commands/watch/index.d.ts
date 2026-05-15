/**
 * Watch command — Ralph's standalone polling process.
 *
 * Thin orchestrator that delegates opt-in features to capabilities.
 * Core triage logic (runCheck, checkPRs) remains inline because it
 * always runs — it is not an opt-in capability.
 */
import type { PlatformAdapter } from '@bradygaster/squad-sdk/platform';
import type { WatchConfig } from './config.js';
export type { WatchConfig } from './config.js';
export { loadWatchConfig } from './config.js';
export type { WatchCapability, WatchContext, WatchPhase, PreflightResult, CapabilityResult } from './types.js';
export { CapabilityRegistry } from './registry.js';
export { createDefaultRegistry } from './capabilities/index.js';
export { createVerboseLogger, type VerboseLogger } from './verbose.js';
export { loadExternalCapabilities } from './external-loader.js';
export { PidTracker, type TrackedProcess } from './pid-tracker.js';
export { getWatchHealth, writePidFile, removePidFile, getPidPath, isProcessAlive, type WatchPidInfo } from './health.js';
/** Normalized work item for watch operations. */
export interface WatchWorkItem {
    number: number;
    title: string;
    body?: string;
    labels: Array<{
        name: string;
    }>;
    assignees: Array<{
        login: string;
    }>;
}
/** Normalized pull request for watch operations. */
export interface WatchPullRequest {
    number: number;
    title: string;
    author: {
        login: string;
    };
    labels: Array<{
        name: string;
    }>;
    isDraft: boolean;
    reviewDecision: string;
    state: string;
    headRefName: string;
    statusCheckRollup: Array<{
        state: string;
        name: string;
    }>;
}
export interface BoardState {
    untriaged: number;
    assigned: number;
    drafts: number;
    needsReview: number;
    changesRequested: number;
    ciFailures: number;
    readyToMerge: number;
    executed: number;
}
/** Outcome of a runCheck call — wraps BoardState with scan status. */
export type RunCheckStatus = 'ok' | 'rate-limited' | 'error';
export interface RunCheckResult {
    state: BoardState;
    status: RunCheckStatus;
}
export interface ReportBoardOptions {
    notifyLevel?: 'all' | 'important' | 'none';
    machineName?: string;
    repoName?: string;
    /** When set, overrides the "Board is clear" message for failed scans. */
    scanStatus?: RunCheckStatus;
}
export declare function reportBoard(state: BoardState, round: number, options?: ReportBoardOptions): void;
/**
 * Legacy WatchOptions type — still accepted by runWatch for backward
 * compatibility.  New code should use {@link WatchConfig} instead.
 */
export interface WatchOptions {
    intervalMinutes: number;
    execute?: boolean;
    copilotFlags?: string;
    agentCmd?: string;
    maxConcurrent?: number;
    issueTimeoutMinutes?: number;
    monitorTeams?: boolean;
    monitorEmail?: boolean;
    board?: boolean;
    boardProject?: number;
    twoPass?: boolean;
    waveDispatch?: boolean;
    retro?: boolean;
    decisionHygiene?: boolean;
    channelRouting?: boolean;
}
export { findExecutableIssues, classifyIssue } from './capabilities/execute.js';
export declare function buildAgentCommand(issue: WatchWorkItem, teamRoot: string, options: WatchOptions): {
    cmd: string;
    args: string[];
};
export declare function selfPull(teamRoot: string): Promise<void>;
export declare function executeIssue(issue: WatchWorkItem, teamRoot: string, options: WatchOptions, adapter: PlatformAdapter): Promise<{
    success: boolean;
    error?: string;
}>;
/**
 * Run watch command — Ralph's local polling process.
 *
 * Accepts either the new {@link WatchConfig} or the legacy
 * {@link WatchOptions} bag for backward compatibility.
 */
export declare function runWatch(dest: string, options: WatchOptions | WatchConfig): Promise<void>;
//# sourceMappingURL=index.d.ts.map