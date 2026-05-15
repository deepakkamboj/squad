/**
 * Retro capability — enforce retrospective checks (Fridays or when missed).
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
export class RetroCapability {
    name = 'retro';
    description = 'Enforce retrospective checks (Fridays or when missed >7 days)';
    configShape = 'boolean';
    requires = ['gh'];
    phase = 'housekeeping';
    async preflight(_context) {
        return { ok: true };
    }
    async execute(context) {
        try {
            const now = new Date();
            const isFriday = now.getUTCDay() === 5;
            const isAfternoon = now.getUTCHours() >= 14;
            const logDir = path.join(context.teamRoot, '.squad', 'log');
            let lastRetroAge = Infinity;
            try {
                const files = storage.listSync?.(logDir) ?? [];
                const retroFiles = (Array.isArray(files) ? files : [])
                    .filter((f) => f.includes('retrospective'));
                if (retroFiles.length > 0) {
                    retroFiles.sort().reverse();
                    const newest = retroFiles[0];
                    const dateMatch = newest.match(/(\d{4}-\d{2}-\d{2})/);
                    if (dateMatch) {
                        const retroDate = new Date(dateMatch[1]);
                        lastRetroAge = now.getTime() - retroDate.getTime();
                    }
                }
            }
            catch { /* no log dir */ }
            const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
            const isDue = (isFriday && isAfternoon) || lastRetroAge > sevenDaysMs;
            if (!isDue) {
                return { success: true, summary: 'retro not due' };
            }
            const dateSlug = now.toISOString().slice(0, 10);
            const prompt = `Run a sprint retrospective for the squad. ` +
                `Review recent GitHub activity (issues closed, PRs merged, CI status). ` +
                `Summarize: what went well, what didn't, action items. ` +
                `Write the output to .squad/log/${dateSlug}-retrospective.md`;
            const { cmd, args } = buildAgentCommand(prompt, context);
            await spawnWithTimeout(cmd, args, context.teamRoot, 120_000);
            return { success: true, summary: 'retrospective completed' };
        }
        catch (e) {
            return { success: false, summary: `retro: ${e.message}` };
        }
    }
}
//# sourceMappingURL=retro.js.map