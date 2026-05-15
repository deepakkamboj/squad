/**
 * Session registry — tracks active agent sessions within the interactive shell.
 */
export class SessionRegistry {
    sessions = new Map();
    register(name, role) {
        const session = {
            name,
            role,
            status: 'idle',
            startedAt: new Date(),
        };
        this.sessions.set(name.toLowerCase(), session);
        return session;
    }
    get(name) {
        return this.sessions.get(name.toLowerCase());
    }
    getAll() {
        return Array.from(this.sessions.values());
    }
    getActive() {
        return this.getAll().filter(s => s.status === 'working' || s.status === 'streaming');
    }
    updateStatus(name, status) {
        const session = this.sessions.get(name.toLowerCase());
        if (session) {
            session.status = status;
            // Clear activity hint when agent goes idle or errors
            if (status === 'idle' || status === 'error')
                session.activityHint = undefined;
        }
    }
    updateActivityHint(name, hint) {
        const session = this.sessions.get(name.toLowerCase());
        if (session)
            session.activityHint = hint;
    }
    updateModel(name, model) {
        const session = this.sessions.get(name.toLowerCase());
        if (session)
            session.model = model;
    }
    remove(name) {
        return this.sessions.delete(name.toLowerCase());
    }
    clear() {
        this.sessions.clear();
    }
}
//# sourceMappingURL=sessions.js.map