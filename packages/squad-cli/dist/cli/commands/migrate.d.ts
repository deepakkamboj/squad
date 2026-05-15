/**
 * Squad Migrate Command — converts between markdown-only and SDK-First formats
 * @module cli/commands/migrate
 */
export interface MigrateOptions {
    to?: 'sdk' | 'markdown';
    from?: 'ai-team';
    dryRun?: boolean;
}
/**
 * Main migrate command handler
 */
export declare function runMigrate(cwd: string, options: MigrateOptions): Promise<void>;
//# sourceMappingURL=migrate.d.ts.map