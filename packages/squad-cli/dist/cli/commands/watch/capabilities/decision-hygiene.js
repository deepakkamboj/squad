/**
 * DecisionHygiene capability — merge decision inbox when >5 files.
 */
import path from 'node:path';
import { execFile } from 'node:child_process';
import { FSStorageProvider } from '@bradygaster/squad-sdk';
const storage = new FSStorageProvider();
function buildAgentCommand(prompt, context) {
    if (context.agentCmd) {
        const parts = context.agentCmd.trim().split(/\s+/);
        return { cmd: parts[0], args: [...parts.slice(1), '-p', prompt] };
    }
    const args = ['-p', prompt];
    if (context.copilotFlags)
        args.push(...context.copilotFlags.trim().split(/\s+/));
    return { cmd: 'copilot', args };
}
function spawnWithTimeout(cmd, args, cwd, timeoutMs) {
    return new Promise((resolve, reject) => {
        execFile(cmd, args, { cwd, timeout: timeoutMs, maxBuffer: 50 * 1024 * 1024 }, (err) => {
            if (err) {
                const execErr = err;
                reject(new Error(execErr.killed ? `Timed out after ${Math.round(timeoutMs / 1000)}s` : execErr.message));
            }
            else {
                resolve();
            }
        });
    });
}
export class DecisionHygieneCapability {
    name = 'decision-hygiene';
    description = 'Auto-merge decision inbox when >5 files accumulate';
    configShape = 'boolean';
    requires = ['gh'];
    phase = 'housekeeping';
    async preflight(context) {
        const inboxDir = path.join(context.teamRoot, '.squad', 'decisions', 'inbox');
        if (!storage.existsSync(inboxDir)) {
            return { ok: false, reason: 'no decision inbox directory found' };
        }
        return { ok: true };
    }
    async execute(context) {
        try {
            const inboxDir = path.join(context.teamRoot, '.squad', 'decisions', 'inbox');
            if (!storage.existsSync(inboxDir)) {
                return { success: true, summary: 'no decision inbox' };
            }
            let fileCount = 0;
            try {
                const files = storage.listSync?.(inboxDir) ?? [];
                fileCount = Array.isArray(files) ? files.filter((f) => f.endsWith('.md')).length : 0;
            }
            catch {
                return { success: true, summary: 'decision inbox empty' };
            }
            if (fileCount <= 5) {
                return { success: true, summary: `decision inbox: ${fileCount} files (threshold: >5)` };
            }
            const prompt = 'Merge the decision inbox files in .squad/decisions/inbox/ into .squad/decisions.md. ' +
                'Append each decision as a new section. After merging, delete the inbox files.';
            const { cmd, args } = buildAgentCommand(prompt, context);
            await spawnWithTimeout(cmd, args, context.teamRoot, 60_000);
            return { success: true, summary: `decision inbox merged (${fileCount} files)` };
        }
        catch (e) {
            return { success: false, summary: `decision hygiene: ${e.message}` };
        }
    }
}
//# sourceMappingURL=decision-hygiene.js.map