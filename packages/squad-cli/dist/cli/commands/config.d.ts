/**
 * Config command — manage squad configuration.
 *
 * Usage:
 *   squad config model                          — show current model configuration
 *   squad config model <model-name>             — set default model for all agents
 *   squad config model <model-name> --agent <n> — pin model to a specific agent
 *   squad config model --clear                  — clear default model override
 *   squad config model --clear --agent <n>      — clear a specific agent's override
 */
export declare function runConfig(cwd: string, subArgs: string[]): Promise<void>;
//# sourceMappingURL=config.d.ts.map