import type { SchedulerState, JobState } from './types.js';
export declare function loadState(): SchedulerState;
export declare function saveState(state: SchedulerState): void;
export declare function getJobState(state: SchedulerState, jobId: string): JobState;
export declare function setJobState(state: SchedulerState, jobId: string, patch: Partial<JobState>): void;
//# sourceMappingURL=state.d.ts.map