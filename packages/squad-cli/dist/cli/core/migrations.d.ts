/**
 * Version-based migration runner
 * Runs additive migrations between versions
 * @module cli/core/migrations
 */
/**
 * Run migrations applicable for upgrading from oldVersion to newVersion
 * Returns array of migration descriptions that were applied
 */
export declare function runMigrations(squadDir: string, oldVersion: string, newVersion: string): Promise<string[]>;
//# sourceMappingURL=migrations.d.ts.map