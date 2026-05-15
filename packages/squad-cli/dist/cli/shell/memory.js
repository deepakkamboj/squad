/**
 * Memory management for shell sessions.
 * Enforces buffer limits and handles cleanup.
 */
export const DEFAULT_LIMITS = {
    maxMessages: 200,
    maxStreamBuffer: 1024 * 1024, // 1MB
    maxSessions: 10,
    sessionIdleTimeout: 5 * 60 * 1000, // 5 minutes
};
export class MemoryManager {
    limits;
    bufferSizes = new Map();
    constructor(limits = {}) {
        this.limits = { ...DEFAULT_LIMITS, ...limits };
    }
    /** Check if a new session can be created */
    canCreateSession(currentCount) {
        return currentCount < this.limits.maxSessions;
    }
    /** Track buffer growth, return true if within limits */
    trackBuffer(sessionId, additionalBytes) {
        const current = this.bufferSizes.get(sessionId) ?? 0;
        const newSize = current + additionalBytes;
        if (newSize > this.limits.maxStreamBuffer) {
            return false; // would exceed limit
        }
        this.bufferSizes.set(sessionId, newSize);
        return true;
    }
    /** Trim message history to limit */
    trimMessages(messages) {
        if (messages.length <= this.limits.maxMessages)
            return messages;
        return messages.slice(-this.limits.maxMessages);
    }
    /** Trim messages and return both kept and archived portions */
    trimWithArchival(messages) {
        if (messages.length <= this.limits.maxMessages) {
            return { kept: messages, archived: [] };
        }
        const cutoff = messages.length - this.limits.maxMessages;
        return {
            kept: messages.slice(cutoff),
            archived: messages.slice(0, cutoff),
        };
    }
    /** Clear buffer tracking for a session */
    clearBuffer(sessionId) {
        this.bufferSizes.delete(sessionId);
    }
    /** Get current memory stats */
    getStats() {
        let total = 0;
        for (const size of this.bufferSizes.values())
            total += size;
        return { sessions: this.bufferSizes.size, totalBufferBytes: total };
    }
    /** Get configured limits */
    getLimits() {
        return { ...this.limits };
    }
}
//# sourceMappingURL=memory.js.map