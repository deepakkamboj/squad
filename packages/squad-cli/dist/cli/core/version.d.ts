/**
 * Version stamping and reading utilities — zero dependencies
 */
/**
 * Get package version from package.json
 * Walks up from the current file to find package.json — works from both
 * compiled dist/cli/core/version.js and bundled cli.js at the root.
 */
export declare function getPackageVersion(): string;
/**
 * Stamp version into squad.agent.md after copying
 */
export declare function stampVersion(filePath: string, version: string): void;
/**
 * Read version from squad.agent.md HTML comment
 */
export declare function readInstalledVersion(filePath: string): string | null;
//# sourceMappingURL=version.d.ts.map