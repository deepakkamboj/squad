/**
 * Workflow generation for non-npm projects — zero dependencies
 */
import type { ProjectType } from './project-type.js';
export declare const PROJECT_TYPE_SENSITIVE_WORKFLOWS: Set<string>;
/**
 * Generate a stub workflow for non-npm projects so no broken npm commands run
 */
export declare function generateProjectWorkflowStub(workflowFile: string, projectType: ProjectType): string | null;
//# sourceMappingURL=workflows.d.ts.map