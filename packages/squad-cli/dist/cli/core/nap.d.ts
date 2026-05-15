/**
 * Nap — context hygiene engine for .squad/ state
 * Compresses histories, prunes logs, archives decisions, cleans inbox.
 * @module cli/core/nap
 */
export interface NapOptions {
    squadDir: string;
    deep?: boolean;
    dryRun?: boolean;
}
export interface NapResult {
    before: NapMetrics;
    after: NapMetrics;
    actions: NapAction[];
}
export interface NapMetrics {
    totalFiles: number;
    totalBytes: number;
    historyBytes: number;
    logBytes: number;
    decisionBytes: number;
    inboxFiles: number;
}
export interface NapAction {
    type: 'compress' | 'prune' | 'archive' | 'merge' | 'cleanup';
    target: string;
    description: string;
    bytesSaved: number;
}
export declare function runNap(options: NapOptions): Promise<NapResult>;
/**
 * Synchronous version of runNap for use in REPL (executeCommand is sync).
 * All internal operations use sync fs calls, so this is safe.
 */
export declare function runNapSync(options: NapOptions): NapResult;
export declare function formatNapReport(result: NapResult, noColor?: boolean): string;
//# sourceMappingURL=nap.d.ts.map