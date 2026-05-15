/**
 * Project type detection — zero dependencies
 */
export type ProjectType = 'npm' | 'go' | 'python' | 'java' | 'dotnet' | 'unknown';
/**
 * Detect project type by checking for marker files in the target directory
 */
export declare function detectProjectType(dir: string): ProjectType;
//# sourceMappingURL=project-type.d.ts.map