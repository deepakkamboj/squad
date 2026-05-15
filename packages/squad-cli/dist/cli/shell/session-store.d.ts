/**
 * Session persistence — save and restore shell message history across restarts.
 *
 * Sessions are stored as JSON files in `.squad/sessions/`.
 * Each file is named `{safeTimestamp}_{sessionId}.json`.
 */
import type { ShellMessage } from './types.js';
/** Serialisable session envelope persisted to disk. */
export interface SessionData {
    id: string;
    createdAt: string;
    lastActiveAt: string;
    messages: ShellMessage[];
}
/** Lightweight summary returned by {@link listSessions}. */
export interface SessionSummary {
    id: string;
    createdAt: string;
    lastActiveAt: string;
    messageCount: number;
    filePath: string;
}
/**
 * Create a new, empty session and return its data envelope.
 */
export declare function createSession(): SessionData;
/**
 * Persist a session to disk.
 *
 * The file is named `{safeTimestamp}_{id}.json` so that lexicographic sorting
 * equals chronological ordering while remaining Windows-safe.
 */
export declare function saveSession(teamRoot: string, session: SessionData): string;
/**
 * List all persisted sessions, most recent first.
 */
export declare function listSessions(teamRoot: string): SessionSummary[];
/**
 * Load the most recent session if it was active within the last 24 hours.
 * Returns `null` when no recent session exists.
 */
export declare function loadLatestSession(teamRoot: string): SessionData | null;
/**
 * Load a specific session by ID.
 */
export declare function loadSessionById(teamRoot: string, sessionId: string): SessionData | null;
//# sourceMappingURL=session-store.d.ts.map