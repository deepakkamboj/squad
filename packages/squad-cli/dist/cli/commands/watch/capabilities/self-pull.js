/**
 * SelfPull capability — git stash + fetch + pull --ff-only + stash pop.
 *
 * Matches PS1 behavior: stashes local changes before pulling, pops after,
 * and warns if watch source files changed (restart recommended).
 */
import { execFile, execFileSync } from 'node:child_process';
export class SelfPullCapability {
    name = 'self-pull';
    description = 'Git fetch/pull at round start to keep work-tree current';
    configShape = 'boolean';
    requires = ['git'];
    phase = 'pre-scan';
    async preflight(_context) {
        return new Promise((resolve) => {
            execFile('git', ['--version'], (err) => {
                resolve(err ? { ok: false, reason: 'git not found' } : { ok: true });
            });
        });
    }
    async execute(context) {
        const cwd = context.teamRoot;
        try {
            // Capture HEAD before pull for change detection
            let headBefore = '';
            try {
                headBefore = execFileSync('git', ['rev-parse', 'HEAD'], { cwd, encoding: 'utf-8' }).trim();
            }
            catch { /* non-fatal */ }
            // Stash if there are local changes
            let didStash = false;
            try {
                const status = execFileSync('git', ['status', '--porcelain'], { cwd, encoding: 'utf-8' }).trim();
                if (status.length > 0) {
                    execFileSync('git', ['stash', '--include-untracked'], { cwd, encoding: 'utf-8' });
                    didStash = true;
                }
            }
            catch { /* non-fatal — proceed without stash */ }
            // Fetch + pull
            await new Promise((resolve, reject) => {
                execFile('git', ['fetch', '--quiet'], { cwd }, (err) => err ? reject(err) : resolve());
            });
            await new Promise((resolve, reject) => {
                execFile('git', ['pull', '--ff-only', '--quiet'], { cwd }, (err) => err ? reject(err) : resolve());
            });
            // Pop stash if we created one
            if (didStash) {
                try {
                    execFileSync('git', ['stash', 'pop'], { cwd, encoding: 'utf-8' });
                }
                catch {
                    console.log('⚠️  git stash pop failed (possible merge conflict) — changes remain in stash');
                }
            }
            // Check if watch source files changed
            let sourceChanged = false;
            if (headBefore) {
                try {
                    const headAfter = execFileSync('git', ['rev-parse', 'HEAD'], { cwd, encoding: 'utf-8' }).trim();
                    if (headBefore !== headAfter) {
                        const diff = execFileSync('git', ['diff', '--name-only', headBefore, headAfter, '--', 'packages/squad-cli/src/'], { cwd, encoding: 'utf-8' }).trim();
                        if (diff.length > 0) {
                            sourceChanged = true;
                            console.log('⚠️  Watch source changed — restart recommended for latest behavior');
                        }
                    }
                }
                catch { /* non-fatal */ }
            }
            return {
                success: true,
                summary: sourceChanged ? 'git pull ok (source changed — restart recommended)' : 'git pull ok',
            };
        }
        catch {
            return { success: true, summary: 'git pull skipped (not on tracking branch or conflicts)' };
        }
    }
}
//# sourceMappingURL=self-pull.js.map