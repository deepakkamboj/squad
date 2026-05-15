/**
 * Memory management for shell sessions.
 * Enforces buffer limits and handles cleanup.
 */
export interface MemoryLimits {
    /** Max messages to keep in history (default: 200) */
    maxMessages: number;
    /** Max buffer size per stream in bytes (default: 1MB) */
    maxStreamBuffer: number;
    /** Max concurrent sessions (default: 10) */
    maxSessions: number;
    /** Session idle timeout in ms (default: 5 minutes) */
    sessionIdleTimeout: number;
}
export declare const DEFAULT_LIMITS: MemoryLimits;
export declare class MemoryManager {
    private limits;
    private bufferSizes;
    constructor(limits?: Partial<MemoryLimits>);
    /** Check if a new session can be created */
    canCreateSession(currentCount: number): boolean;
    /** Track buffer growth, return true if within limits */
    trackBuffer(sessionId: string, additionalBytes: number): boolean;
    /** Trim message history to limit */
    trimMessages<T>(messages: T[]): T[];
    /** Trim messages and return both kept and archived portions */
    trimWithArchival<T>(messages: T[]): {
        kept: T[];
        archived: T[];
    };
    /** Clear buffer tracking for a session */
    clearBuffer(sessionId: string): void;
    /** Get current memory stats */
    getStats(): {
        sessions: number;
        totalBufferBytes: number;
    };
    /** Get configured limits */
    getLimits(): Readonly<MemoryLimits>;
}
//# sourceMappingURL=memory.d.ts.map