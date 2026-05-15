/**
 * In-Copilot Installation Path (M4-6, Issue #106)
 *
 * Detects the Copilot runtime environment and provides
 * platform-specific installation + scaffolding instructions.
 * Wires into initSquad() from M2-6 for project creation.
 *
 * @module cli/copilot-install
 */
/** Recognised Copilot environments. */
export type CopilotEnvironment = 'cli' | 'vscode' | 'web' | 'unknown';
/** Configuration for in-Copilot installation. */
export interface InstallConfig {
    /** Project name */
    projectName?: string;
    /** Project description */
    projectDescription?: string;
    /** Agent names to scaffold */
    agents?: string[];
    /** Config format */
    configFormat?: 'typescript' | 'json';
}
/** Result of an in-Copilot installation. */
export interface CopilotInstallResult {
    /** Whether the installation succeeded */
    success: boolean;
    /** Detected environment */
    environment: CopilotEnvironment;
    /** Files created during installation */
    createdFiles: string[];
    /** Human-readable installation instructions that were applied */
    instructions: string[];
}
/** Single install instruction step. */
export interface InstallStep {
    /** Step description */
    description: string;
    /** Shell command to run (if applicable) */
    command?: string;
}
/** Indicators used for environment detection. */
export interface EnvironmentIndicators {
    env: Record<string, string | undefined>;
    argv: string[];
}
/**
 * Detect which Copilot environment is active.
 *
 * Heuristics (checked in order):
 * 1. `VSCODE_PID` or `VSCODE_IPC_HOOK` → vscode
 * 2. `CODESPACES` or `GITHUB_CODESPACE_TOKEN` → web
 * 3. `COPILOT_CLI` env var → cli
 * 4. `--copilot-cli` argv flag → cli
 * 5. Otherwise → unknown
 */
export declare function detectCopilotEnvironment(indicators?: EnvironmentIndicators): CopilotEnvironment;
/**
 * Return platform-specific install steps for a detected environment.
 */
export declare function getInstallInstructions(env: CopilotEnvironment): InstallStep[];
/**
 * Run a full "install Squad from inside Copilot" flow.
 *
 * Generates `.squad/` scaffolding via initSquad() from M2-6
 * and returns environment-aware instructions.
 *
 * @param env - Detected Copilot environment
 * @param projectDir - Root directory of the project
 * @param config - Optional install configuration
 * @returns CopilotInstallResult
 */
export declare function installFromCopilot(env: CopilotEnvironment, projectDir: string, config?: InstallConfig): Promise<CopilotInstallResult>;
//# sourceMappingURL=copilot-install.d.ts.map