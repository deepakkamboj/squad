/**
 * GitHub CLI wrapper utilities — zero dependencies
 */
export interface GhIssue {
    number: number;
    title: string;
    body?: string;
    labels: Array<{
        name: string;
    }>;
    assignees: Array<{
        login: string;
    }>;
}
export interface GhListOptions {
    label?: string;
    state?: 'open' | 'closed' | 'all';
    limit?: number;
}
export interface GhEditOptions {
    addLabel?: string;
    removeLabel?: string;
    addAssignee?: string;
    removeAssignee?: string;
}
export interface GhPullRequest {
    number: number;
    title: string;
    author: {
        login: string;
    };
    labels: Array<{
        name: string;
    }>;
    isDraft: boolean;
    reviewDecision: string;
    state: string;
    headRefName: string;
    statusCheckRollup: Array<{
        state: string;
        name: string;
    }>;
}
export interface GhPrListOptions {
    state?: 'open' | 'closed' | 'merged' | 'all';
    limit?: number;
    label?: string;
}
/**
 * Check if gh CLI is available
 */
export declare function ghAvailable(): Promise<boolean>;
/**
 * Check if gh CLI is authenticated
 */
export declare function ghAuthenticated(): Promise<boolean>;
/**
 * List issues with optional filters
 */
export declare function ghIssueList(options?: GhListOptions): Promise<GhIssue[]>;
export declare function ghPrList(options?: GhPrListOptions): Promise<GhPullRequest[]>;
/**
 * Edit an issue (add/remove labels or assignees)
 */
export declare function ghIssueEdit(issueNumber: number, options: GhEditOptions): Promise<void>;
export interface GhRateLimit {
    remaining: number;
    limit: number;
    resetAt: string;
}
/**
 * Check current GitHub API rate limit via `gh api rate_limit`.
 */
export declare function ghRateLimitCheck(): Promise<GhRateLimit>;
/**
 * Detect if an error is a GitHub rate-limit error (429 or explicit rate-limit messages).
 * Does NOT match bare 403 — that indicates an auth/permissions error, not a transient rate limit.
 */
export declare function isRateLimitError(err: unknown): boolean;
//# sourceMappingURL=gh-cli.d.ts.map