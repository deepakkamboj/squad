/**
 * Board capability — project board lifecycle + reconciliation.
 */
import type { WatchCapability, WatchContext, PreflightResult, CapabilityResult } from '../types.js';
export declare class BoardCapability implements WatchCapability {
    readonly name = "board";
    readonly description = "Project board lifecycle (In Progress / Done / Blocked + reconciliation)";
    readonly configShape: "object";
    readonly requires: string[];
    readonly phase: "post-execute";
    preflight(_context: WatchContext): Promise<PreflightResult>;
    execute(context: WatchContext): Promise<CapabilityResult>;
}
/**
 * Move an issue to a status column on a GitHub Projects v2 board.
 * Exported so the main orchestrator can call it for execute-mode transitions.
 */
export declare function updateBoardStatus(issueNumber: number, status: 'in-progress' | 'done' | 'blocked' | 'todo', options: {
    projectNumber?: number;
    owner?: string;
}): Promise<void>;
//# sourceMappingURL=board.d.ts.map