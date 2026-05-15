import type { SchedulerEvent, EventKind } from './types.js';
export declare function emitEvent(jobId: string, kind: EventKind, extra?: Partial<SchedulerEvent>): void;
export declare function emitGlobal(kind: EventKind, message?: string): void;
//# sourceMappingURL=events.d.ts.map