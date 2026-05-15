/**
 * Directory migration utility — renames .ai-team/ → .squad/
 * @module cli/core/migrate-directory
 */
/**
 * Migrate .ai-team/ directory to .squad/
 * Updates .gitattributes and .gitignore references
 * Scrubs email addresses from all files
 */
export declare function migrateDirectory(dest: string): Promise<void>;
//# sourceMappingURL=migrate-directory.d.ts.map