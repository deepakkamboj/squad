/**
 * MonitorTeams capability — scan Teams for actionable messages via WorkIQ.
 */
import { execFile } from 'node:child_process';
/** Build agent command from prompt, respecting --agent-cmd. */
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
export class MonitorTeamsCapability {
    name = 'monitor-teams';
    description = 'Scan Teams for actionable messages each round (requires WorkIQ MCP)';
    configShape = 'boolean';
    requires = ['gh', 'WorkIQ MCP'];
    phase = 'housekeeping';
    async preflight(_context) {
        // WorkIQ availability can only be checked at runtime; preflight is optimistic
        return { ok: true };
    }
    async execute(context) {
        try {
            const prompt = 'Check Teams for actionable messages from the last 30 minutes. ' +
                'Use workiq-ask_work_iq to query: "Teams messages in last 30 min mentioning action items, reviews, urgent requests". ' +
                'For each actionable item found, create a GitHub issue with the label "teams-bridge". ' +
                'First check existing open issues with label "teams-bridge" to avoid duplicates. ' +
                'If WorkIQ is not available, just report that and exit.';
            const { cmd, args } = buildAgentCommand(prompt, context);
            await spawnWithTimeout(cmd, args, context.teamRoot, 60_000);
            return { success: true, summary: 'Teams scan complete' };
        }
        catch (e) {
            return { success: false, summary: `Teams monitor: ${e.message}` };
        }
    }
}
//# sourceMappingURL=monitor-teams.js.map