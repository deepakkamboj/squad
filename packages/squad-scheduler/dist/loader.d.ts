import type { SchedulerJob } from './types.js';
export declare function loadConfig(cwd?: string): SchedulerJob[];
/** Watch the config file for changes. Returns a stop function. */
export declare function watchConfig(cwd: string, onChange: (jobs: SchedulerJob[]) => void): () => void;
//# sourceMappingURL=loader.d.ts.map