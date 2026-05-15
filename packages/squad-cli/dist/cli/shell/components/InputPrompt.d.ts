import React from 'react';
import { type AgentInfo } from '../autocomplete.js';
interface InputPromptProps {
    onSubmit: (value: string) => void;
    prompt?: string;
    disabled?: boolean;
    agents?: AgentInfo[];
    /** Number of messages exchanged so far — drives progressive hint text. */
    messageCount?: number;
}
export declare const InputPrompt: React.FC<InputPromptProps>;
export {};
//# sourceMappingURL=InputPrompt.d.ts.map