/**
 * Template system types and manifest for Squad initialization.
 * @module cli/core/templates
 */
/** Template file descriptor */
export interface TemplateFile {
    /** Source path relative to templates/ */
    source: string;
    /** Destination path relative to .squad/ directory */
    destination: string;
    /** Whether this file should be overwritten on upgrade */
    overwriteOnUpgrade: boolean;
    /** Description for logging */
    description: string;
}
/**
 * Template manifest — all files that init copies.
 *
 * Categorization:
 * - Squad-owned (overwriteOnUpgrade: true): squad.agent.md, workflows, template files, casting data
 * - User-owned (overwriteOnUpgrade: false): team.md, routing.md, decisions.md, ceremonies.md, agent history/identity
 */
export declare const TEMPLATE_MANIFEST: TemplateFile[];
/**
 * Get the templates directory path.
 * Walks up from the current file to find templates/ — works both
 * from compiled dist/cli/core/templates.js and from a bundled cli.js at the root.
 */
export declare function getTemplatesDir(): string;
//# sourceMappingURL=templates.d.ts.map