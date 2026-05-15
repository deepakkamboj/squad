/**
 * GitHub CLI wrapper utilities — zero dependencies
 */
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const execFileAsync = promisify(execFile);
/**
 * Check if gh CLI is available
 */
export async function ghAvailable() {
    try {
        await execFileAsync('gh', ['--version']);
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Check if gh CLI is authenticated
 */
export async function ghAuthenticated() {
    try {
        await execFileAsync('gh', ['auth', 'status']);
        return true;
    }
    catch {
        return false;
    }
}
/**
 * List issues with optional filters
 */
export async function ghIssueList(options = {}) {
    const args = ['issue', 'list', '--json', 'number,title,body,labels,assignees'];
    if (options.label) {
        args.push('--label', options.label);
    }
    if (options.state) {
        args.push('--state', options.state);
    }
    if (options.limit) {
        args.push('--limit', String(options.limit));
    }
    const { stdout } = await execFileAsync('gh', args);
    return JSON.parse(stdout || '[]');
}
export async function ghPrList(options = {}) {
    const args = ['pr', 'list', '--json', 'number,title,author,labels,isDraft,reviewDecision,state,headRefName,statusCheckRollup'];
    if (options.state) {
        args.push('--state', options.state);
    }
    if (options.limit) {
        args.push('--limit', String(options.limit));
    }
    if (options.label) {
        args.push('--label', options.label);
    }
    const { stdout } = await execFileAsync('gh', args);
    return JSON.parse(stdout || '[]');
}
/**
 * Edit an issue (add/remove labels or assignees)
 */
export async function ghIssueEdit(issueNumber, options) {
    const args = ['issue', 'edit', String(issueNumber)];
    if (options.addLabel) {
        args.push('--add-label', options.addLabel);
    }
    if (options.removeLabel) {
        args.push('--remove-label', options.removeLabel);
    }
    if (options.addAssignee) {
        args.push('--add-assignee', options.addAssignee);
    }
    if (options.removeAssignee) {
        args.push('--remove-assignee', options.removeAssignee);
    }
    await execFileAsync('gh', args);
}
/**
 * Check current GitHub API rate limit via `gh api rate_limit`.
 */
export async function ghRateLimitCheck() {
    const { stdout } = await execFileAsync('gh', [
        'api', 'rate_limit', '--jq', '.resources.core | {remaining, limit, reset}',
    ]);
    const data = JSON.parse(stdout);
    return {
        remaining: data.remaining,
        limit: data.limit,
        resetAt: new Date(data.reset * 1000).toISOString(),
    };
}
/**
 * Detect if an error is a GitHub rate-limit error (429 or explicit rate-limit messages).
 * Does NOT match bare 403 — that indicates an auth/permissions error, not a transient rate limit.
 */
export function isRateLimitError(err) {
    if (err instanceof Error) {
        const msg = err.message.toLowerCase();
        return msg.includes('rate limit') || msg.includes('secondary rate') || msg.includes('429');
    }
    return false;
}
//# sourceMappingURL=gh-cli.js.map