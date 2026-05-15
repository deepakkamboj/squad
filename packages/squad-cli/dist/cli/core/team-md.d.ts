/**
 * team.md parser and editor utilities — zero dependencies
 */
/**
 * Read team.md content from squad directory
 */
export declare function readTeamMd(squadDir: string): string;
/**
 * Write team.md content to squad directory
 */
export declare function writeTeamMd(squadDir: string, content: string): void;
/**
 * Check if @copilot section exists in team.md
 */
export declare function hasCopilot(content: string): boolean;
/**
 * Insert @copilot section before Project Context
 */
export declare function insertCopilotSection(content: string, autoAssign?: boolean): string;
/**
 * Remove @copilot section from team.md
 */
export declare function removeCopilotSection(content: string): string;
/**
 * Set auto-assign flag in team.md
 */
export declare function setAutoAssign(content: string, enabled: boolean): string;
//# sourceMappingURL=team-md.d.ts.map