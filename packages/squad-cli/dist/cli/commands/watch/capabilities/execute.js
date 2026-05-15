/**
 * Execute capability — spawns Copilot sessions for eligible issues.
 */
import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { createVerboseLogger } from '../verbose.js';
/** Check whether an issue carries a squad or squad:* label. */
function hasSquadLabel(issue) {
    return issue.labels.some(l => l.name === 'squad' || l.name.startsWith('squad:'));
}
/** Keywords that indicate read-heavy / analysis work. */
const READ_KEYWORDS = [
    'research', 'review', 'analyze', 'investigate', 'audit',
    'check', 'scan', 'assess', 'evaluate', 'fact-check',
    'document', 'report',
];
/** Keywords that indicate write-heavy / implementation work. */
const WRITE_KEYWORDS = [
    'fix', 'implement', 'create', 'build', 'refactor',
    'add', 'update', 'migrate', 'deploy', 'feature',
];
/** Classify an issue as read-heavy or write-heavy by title keywords. */
export function classifyIssue(title) {
    const lower = title.toLowerCase();
    const isRead = READ_KEYWORDS.some(k => lower.includes(k));
    const isWrite = WRITE_KEYWORDS.some(k => lower.includes(k));
    if (isRead && !isWrite)
        return 'read';
    return 'write'; // default to write (safer — gets full agent session)
}
/** Build agent command for a prompt. */
function buildAgentCommand(prompt, context) {
    if (context.agentCmd) {
        const parts = context.agentCmd.trim().split(/\s+/);
        const cmd = parts[0];
        const args = [...parts.slice(1), '-p', prompt];
        return { cmd, args };
    }
    const args = ['-p', prompt];
    if (context.copilotFlags) {
        args.push(...context.copilotFlags.trim().split(/\s+/));
    }
    return { cmd: 'copilot', args };
}
/** Labels that indicate an issue should not be auto-executed. */
const BLOCKING_LABELS = ['status:blocked', 'status:wontfix', 'status:on-hold', 'blocked'];
/** Check whether an issue has a blocking status label. */
function hasBlockingLabel(issue) {
    return issue.labels.some(l => BLOCKING_LABELS.includes(l.name));
}
/** Check whether an issue is already assigned to a human. */
function isAssigned(issue) {
    return issue.assignees.length > 0;
}
/** Find issues eligible for autonomous execution.
 *
 * Pre-filters to keep only clearly actionable items:
 *  - must have a squad/squad:* label
 *  - must not be assigned to a human (agent decides once it reads ralph-instructions.md)
 *  - must not carry a blocking status label
 *
 * Matches the PS1 ralph-watch pre-filter design.
 */
export function findExecutableIssues(_roster, _capabilities, issues) {
    return issues.filter(issue => hasSquadLabel(issue) && !isAssigned(issue) && !hasBlockingLabel(issue));
}
/** Format issue list for the agent prompt. */
function formatIssueList(issues) {
    return issues.map(i => {
        const labels = i.labels.map(l => l.name).join(', ');
        const assigned = i.assignees?.length
            ? `assigned: ${i.assignees.map(a => a.login).join(',')}`
            : 'unassigned';
        return `- #${i.number}: ${i.title} [${labels}] ${assigned}`;
    }).join('\n');
}
/** Build the rich agent prompt matching PS1 ralph-watch design. */
export function buildAgentPrompt(issues, teamRoot) {
    const issueList = formatIssueList(issues);
    const hasInstructions = existsSync(path.join(teamRoot, '.squad', 'ralph-instructions.md'));
    if (hasInstructions) {
        return [
            'Ralph, Go! Read .squad/ralph-instructions.md for your full instructions. Follow ALL sections there. MAXIMIZE PARALLELISM — spawn agents for ALL actionable issues simultaneously.',
            '',
            'Here are the current open squad issues:',
            issueList,
            '',
            'Task: Read the issues, follow your instructions in .squad/ralph-instructions.md, and work on what\'s actionable.',
            'WHY: Keep the squad pipeline moving — no idle work.',
            'Success: Issues get branches, PRs, and progress.',
            'Escalation: If blocked, comment on the issue and move to next.',
        ].join('\n');
    }
    // Fallback when ralph-instructions.md does not exist
    return [
        'You are Ralph, the autonomous work monitor. Review the open squad issues below and work on every actionable one. Skip issues that are blocked, waiting on external input, or already assigned.',
        '',
        'Here are the current open squad issues:',
        issueList,
        '',
        'Task: Triage the list, pick up unblocked/unassigned issues, create branches and PRs.',
        'WHY: Keep the squad pipeline moving — no idle work.',
        'Success: Issues get branches, PRs, and progress.',
        'Escalation: If blocked, comment on the issue and move to next.',
    ].join('\n');
}
/** Spawn a single agent session for all eligible issues. */
async function executeAll(issues, context, timeoutMs) {
    const prompt = buildAgentPrompt(issues, context.teamRoot);
    const { cmd, args } = buildAgentCommand(prompt, context);
    return new Promise((resolve) => {
        const cp = execFile(cmd, args, { cwd: context.teamRoot, timeout: timeoutMs, maxBuffer: 50 * 1024 * 1024 }, (err) => {
            if (err) {
                const execErr = err;
                const msg = execErr.killed ? `Timed out` : execErr.message;
                resolve({ success: false, error: msg });
            }
            else {
                resolve({ success: true });
            }
        });
        // Track child PID for cleanup on exit/crash
        if (context.pidTracker && cp.pid) {
            const issueNums = issues.map(i => `#${i.number}`).join(',');
            context.pidTracker.track(cp.pid, `copilot-session-${issueNums}`);
        }
        cp.on('exit', () => {
            if (context.pidTracker && cp.pid) {
                context.pidTracker.untrack(cp.pid);
            }
        });
    });
}
export class ExecuteCapability {
    name = 'execute';
    description = 'Spawn Copilot sessions to work on eligible issues';
    configShape = 'boolean';
    requires = ['gh'];
    phase = 'post-execute';
    async preflight(_context) {
        return new Promise((resolve) => {
            execFile('gh', ['--version'], (err) => {
                resolve(err ? { ok: false, reason: 'gh CLI not found' } : { ok: true });
            });
        });
    }
    async execute(context) {
        const vlog = createVerboseLogger(context.verbose ?? false);
        try {
            const timeout = (context.config['timeout'] ?? 30) * 60_000;
            vlog.log(`Execute: agentCmd=${context.agentCmd ?? 'copilot'}, timeout=${timeout / 60_000}m`);
            // Fetch open issues with squad label
            const sdkItems = await context.adapter.listWorkItems({ tags: ['squad'], state: 'open', limit: 50 });
            const issues = sdkItems.map(wi => ({
                number: wi.id,
                title: wi.title,
                labels: wi.tags.map(t => ({ name: t })),
                assignees: wi.assignedTo ? [{ login: wi.assignedTo }] : [],
            }));
            // Minimal filter: must have squad or squad:* label (agent decides the rest)
            const eligible = findExecutableIssues(context.roster, null, issues);
            vlog.log(`Execute: ${issues.length} total issues, ${eligible.length} eligible`);
            for (const issue of eligible.slice(0, 5)) {
                const labels = issue.labels.map(l => l.name).join(', ');
                vlog.log(`  → #${issue.number}: "${issue.title}" [${labels}]`);
            }
            if (eligible.length === 0) {
                return { success: true, summary: 'no squad-labeled issues found' };
            }
            // Single agent invocation with all issues — agent reads ralph-instructions.md
            const result = await executeAll(eligible, context, timeout);
            return {
                success: result.success,
                summary: result.success
                    ? `agent dispatched with ${eligible.length} issues`
                    : `agent failed: ${result.error}`,
                data: { dispatched: eligible.length, success: result.success },
            };
        }
        catch (e) {
            return { success: false, summary: `execute error: ${e.message}` };
        }
    }
}
//# sourceMappingURL=execute.js.map