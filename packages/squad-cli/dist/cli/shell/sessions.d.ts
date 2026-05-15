/**
 * Session registry — tracks active agent sessions within the interactive shell.
 */
import { AgentSession } from './types.js';
export declare class SessionRegistry {
    private sessions;
    register(name: string, role: string): AgentSession;
    get(name: string): AgentSession | undefined;
    getAll(): AgentSession[];
    getActive(): AgentSession[];
    updateStatus(name: string, status: AgentSession['status']): void;
    updateActivityHint(name: string, hint: string | undefined): void;
    updateModel(name: string, model: string | undefined): void;
    remove(name: string): boolean;
    clear(): void;
}
//# sourceMappingURL=sessions.d.ts.map