/**
 * Execute capability — spawns Copilot sessions for eligible issues.
 */
import type { WatchCapability, WatchContext, PreflightResult, CapabilityResult } from '../types.js';
import type { MachineCapabilities } from '@bradygaster/squad-sdk/ralph/capabilities';
/** Normalized work item for execution. */
export interface ExecutableWorkItem {
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
/** Classify an issue as read-heavy or write-heavy by title keywords. */
export declare function classifyIssue(title: string): 'read' | 'write';
/** Find issues eligible for autonomous execution.
 *
 * Pre-filters to keep only clearly actionable items:
 *  - must have a squad/squad:* label
 *  - must not be assigned to a human (agent decides once it reads ralph-instructions.md)
 *  - must not carry a blocking status label
 *
 * Matches the PS1 ralph-watch pre-filter design.
 */
export declare function findExecutableIssues(_roster: Array<{
    name: string;
    label: string;
    expertise: string[];
}>, _capabilities: MachineCapabilities | null, issues: ExecutableWorkItem[]): ExecutableWorkItem[];
/** Build the rich agent prompt matching PS1 ralph-watch design. */
export declare function buildAgentPrompt(issues: ExecutableWorkItem[], teamRoot: string): string;
export declare class ExecuteCapability implements WatchCapability {
    readonly name = "execute";
    readonly description = "Spawn Copilot sessions to work on eligible issues";
    readonly configShape: "boolean";
    readonly requires: string[];
    readonly phase: "post-execute";
    preflight(_context: WatchContext): Promise<PreflightResult>;
    execute(context: WatchContext): Promise<CapabilityResult>;
}
//# sourceMappingURL=execute.d.ts.map