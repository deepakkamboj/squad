/**
 * team.md parser and editor utilities — zero dependencies
 */
import path from 'node:path';
import { FSStorageProvider } from '@bradygaster/squad-sdk';
const storage = new FSStorageProvider();
/**
 * Read team.md content from squad directory
 */
export function readTeamMd(squadDir) {
    const teamMdPath = path.join(squadDir, 'team.md');
    if (!storage.existsSync(teamMdPath)) {
        throw new Error('team.md not found — run init first');
    }
    const content = storage.readSync(teamMdPath);
    if (content === undefined) {
        throw new Error('team.md not found — run init first');
    }
    return content;
}
/**
 * Write team.md content to squad directory
 */
export function writeTeamMd(squadDir, content) {
    const teamMdPath = path.join(squadDir, 'team.md');
    storage.writeSync(teamMdPath, content);
}
/**
 * Check if @copilot section exists in team.md
 */
export function hasCopilot(content) {
    return content.includes('🤖 Coding Agent');
}
/**
 * Insert @copilot section before Project Context
 */
export function insertCopilotSection(content, autoAssign = false) {
    const autoAssignValue = autoAssign ? 'true' : 'false';
    const copilotSection = `
## Coding Agent

<!-- copilot-auto-assign: ${autoAssignValue} -->

| Name | Role | Charter | Status |
|------|------|---------|--------|
| @copilot | Coding Agent | — | 🤖 Coding Agent |

### Capabilities

**🟢 Good fit — auto-route when enabled:**
- Bug fixes with clear reproduction steps
- Test coverage (adding missing tests, fixing flaky tests)
- Lint/format fixes and code style cleanup
- Dependency updates and version bumps
- Small isolated features with clear specs
- Boilerplate/scaffolding generation
- Documentation fixes and README updates

**🟡 Needs review — route to @copilot but flag for squad member PR review:**
- Medium features with clear specs and acceptance criteria
- Refactoring with existing test coverage
- API endpoint additions following established patterns
- Migration scripts with well-defined schemas

**🔴 Not suitable — route to squad member instead:**
- Architecture decisions and system design
- Multi-system integration requiring coordination
- Ambiguous requirements needing clarification
- Security-critical changes (auth, encryption, access control)
- Performance-critical paths requiring benchmarking
- Changes requiring cross-team discussion

`;
    // Insert before "## Project Context" if it exists, otherwise append
    if (content.includes('## Project Context')) {
        return content.replace('## Project Context', copilotSection + '## Project Context');
    }
    else {
        return content.trimEnd() + '\n' + copilotSection;
    }
}
/**
 * Remove @copilot section from team.md
 */
export function removeCopilotSection(content) {
    return content.replace(/\n## Coding Agent\n[\s\S]*?(?=\n## |\n*$)/, '');
}
/**
 * Set auto-assign flag in team.md
 */
export function setAutoAssign(content, enabled) {
    const targetValue = enabled ? 'true' : 'false';
    const oppositeValue = enabled ? 'false' : 'true';
    return content.replace(`<!-- copilot-auto-assign: ${oppositeValue} -->`, `<!-- copilot-auto-assign: ${targetValue} -->`);
}
//# sourceMappingURL=team-md.js.map