import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Box, Text, Static, useApp, useInput, useStdout } from 'ink';
import { getBrand } from '../../brand.js';
import { AgentPanel } from './AgentPanel.js';
import { MessageStream, renderMarkdownInline, formatDuration } from './MessageStream.js';
import { InputPrompt } from './InputPrompt.js';
import { parseInput } from '../router.js';
import { executeCommand } from '../commands.js';
import { loadWelcomeData, getRoleEmoji } from '../lifecycle.js';
import { isNoColor, useTerminalWidth, useTerminalHeight, useLayoutTier } from '../terminal.js';
/** Map coordinator/Squad label to the current brand name. Handles old agent
 *  manifests that still say "Squad" as well as the literal 'coordinator' key. */
function resolveAgentLabel(agentName) {
    const brand = getBrand();
    if (!agentName)
        return 'agent';
    const lower = agentName.toLowerCase();
    if (lower === 'coordinator' || lower === 'squad' || agentName === brand.coordinatorAgentName) {
        return brand.nameUpper;
    }
    return agentName;
}
import { Separator } from './Separator.js';
import { MemoryManager } from '../memory.js';
const EXIT_WORDS = new Set(['exit', 'quit', 'q']);
export const App = ({ registry, renderer, teamRoot, version, maxMessages, onReady, onDispatch, onCancel, onRestoreSession }) => {
    const { exit } = useApp();
    // Session-scoped ID ensures Static keys are unique across session boundaries,
    // preventing Ink from confusing items when sessions are restored.
    const sessionId = useMemo(() => Date.now().toString(36), []);
    const memoryManager = useMemo(() => new MemoryManager(maxMessages != null ? { maxMessages } : undefined), [maxMessages]);
    const [messages, setMessages] = useState([]);
    const [archivedMessages, setArchivedMessages] = useState([]);
    const [agents, setAgents] = useState(registry.getAll());
    const [streamingContent, setStreamingContent] = useState(new Map());
    const [processing, setProcessing] = useState(false);
    const [activityHint, setActivityHint] = useState(undefined);
    const [agentActivities, setAgentActivities] = useState(new Map());
    const [welcome, setWelcome] = useState(() => loadWelcomeData(teamRoot));
    /**
     * True after a no-args `/init` so the next user message is treated as a
     * team-cast request (equivalent to `/init <message>`).
     */
    const [awaitingInitPrompt, setAwaitingInitPrompt] = useState(false);
    const messagesRef = useRef([]);
    const ctrlCRef = useRef(0);
    const ctrlCTimerRef = useRef(null);
    // Append messages and enforce the history cap, archiving overflow
    const appendMessages = useCallback((updater) => {
        setMessages(prev => {
            const next = updater(prev);
            const { kept, archived } = memoryManager.trimWithArchival(next);
            if (archived.length > 0) {
                setArchivedMessages(old => [...old, ...archived]);
            }
            return kept;
        });
    }, [memoryManager]);
    // Keep ref in sync so command handlers see latest history
    useEffect(() => { messagesRef.current = messages; }, [messages]);
    // Expose API for external callers (StreamBridge, coordinator)
    useEffect(() => {
        onReady?.({
            addMessage: (msg) => {
                appendMessages(prev => [...prev, msg]);
                if (msg.agentName) {
                    setStreamingContent(prev => {
                        const next = new Map(prev);
                        next.delete(msg.agentName);
                        return next;
                    });
                }
                setActivityHint(undefined);
            },
            clearMessages: () => {
                setMessages([]);
                setArchivedMessages([]);
            },
            setStreamingContent: (content) => {
                if (content === null) {
                    setStreamingContent(new Map());
                }
                else {
                    setStreamingContent(prev => {
                        const next = new Map(prev);
                        next.set(content.agentName, content.content);
                        return next;
                    });
                }
            },
            clearAgentStream: (agentName) => {
                setStreamingContent(prev => {
                    const next = new Map(prev);
                    next.delete(agentName);
                    return next;
                });
            },
            setActivityHint,
            setAgentActivity: (agentName, activity) => {
                setAgentActivities(prev => {
                    const next = new Map(prev);
                    if (activity) {
                        next.set(agentName, activity);
                    }
                    else {
                        next.delete(agentName);
                    }
                    return next;
                });
            },
            setProcessing,
            refreshAgents: () => {
                setAgents([...registry.getAll()]);
            },
            refreshWelcome: () => {
                const data = loadWelcomeData(teamRoot);
                if (data)
                    setWelcome(data);
            },
        });
    }, [onReady, registry, appendMessages]);
    // Ctrl+C: cancel operation when processing, double-tap to exit when idle
    useInput((_input, key) => {
        if (key.ctrl && _input === 'c') {
            if (processing && onCancel) {
                // First Ctrl+C while processing → cancel operation and return to prompt
                onCancel();
                setProcessing(false);
                return;
            }
            // Not processing, or no cancel handler → increment double-tap counter
            ctrlCRef.current++;
            if (ctrlCTimerRef.current)
                clearTimeout(ctrlCTimerRef.current);
            if (ctrlCRef.current >= 2) {
                exit();
                return;
            }
            // Single Ctrl+C when idle — show hint, reset after 1s
            ctrlCTimerRef.current = setTimeout(() => { ctrlCRef.current = 0; }, 1000);
            if (!processing) {
                appendMessages(prev => [...prev, {
                        role: 'system',
                        content: 'Press Ctrl+C again to exit.',
                        timestamp: new Date(),
                    }]);
            }
        }
    });
    const handleSubmit = useCallback((input) => {
        // Bare "exit" exits the shell
        if (EXIT_WORDS.has(input.toLowerCase())) {
            exit();
            return;
        }
        const userMsg = { role: 'user', content: input, timestamp: new Date() };
        appendMessages(prev => [...prev, userMsg]);
        const knownAgents = registry.getAll().map(a => a.name);
        const parsed = parseInput(input, knownAgents);
        // If we're awaiting an init prompt and the user sent a non-slash message,
        // treat it as an inline /init <prompt> cast request.
        if (awaitingInitPrompt && parsed.type !== 'slash_command') {
            setAwaitingInitPrompt(false);
            if (!onDispatch) {
                appendMessages(prev => [...prev, {
                        role: 'system',
                        content: 'SDK not connected. Try: (1) squad doctor to check setup, (2) check your internet connection, (3) restart the shell to reconnect.',
                        timestamp: new Date(),
                    }]);
                return;
            }
            const castParsed = {
                type: 'coordinator',
                raw: input,
                content: input,
                skipCastConfirmation: false, // show confirmation, same as freeform cast
            };
            setProcessing(true);
            onDispatch(castParsed).finally(() => {
                setProcessing(false);
                setAgents([...registry.getAll()]);
            });
            return;
        }
        if (parsed.type === 'slash_command') {
            const result = executeCommand(parsed.command, parsed.args ?? [], {
                registry,
                renderer,
                messageHistory: [...messagesRef.current, userMsg],
                teamRoot,
                version,
                onRestoreSession,
            });
            if (result.exit) {
                exit();
                return;
            }
            if (result.clear) {
                setMessages([]);
                setArchivedMessages([]);
                return;
            }
            if (result.triggerInitCast && onDispatch) {
                // /init command returned a cast trigger — dispatch it as a coordinator message
                const castParsed = {
                    type: 'coordinator',
                    raw: result.triggerInitCast.prompt,
                    content: result.triggerInitCast.prompt,
                    skipCastConfirmation: true,
                };
                setProcessing(true);
                onDispatch(castParsed).finally(() => {
                    setProcessing(false);
                    setAgents([...registry.getAll()]);
                });
                return;
            }
            if (result.awaitInitPrompt) {
                // No-args /init: show the guidance and wait for the user's next message
                setAwaitingInitPrompt(true);
            }
            if (result.output) {
                appendMessages(prev => [...prev, {
                        role: 'system',
                        content: result.output,
                        timestamp: new Date(),
                    }]);
            }
        }
        else if (parsed.type === 'direct_agent' || parsed.type === 'coordinator') {
            if (!onDispatch) {
                appendMessages(prev => [...prev, {
                        role: 'system',
                        content: 'SDK not connected. Try: (1) squad doctor to check setup, (2) check your internet connection, (3) restart the shell to reconnect.',
                        timestamp: new Date(),
                    }]);
                return;
            }
            setProcessing(true);
            onDispatch(parsed).finally(() => {
                setProcessing(false);
                setAgents([...registry.getAll()]);
            });
        }
        setAgents([...registry.getAll()]);
    }, [registry, renderer, teamRoot, exit, onDispatch, appendMessages, awaitingInitPrompt]);
    const rosterAgents = welcome?.agents ?? [];
    const noColor = isNoColor();
    const width = useTerminalWidth();
    const tier = useLayoutTier();
    const terminalHeight = useTerminalHeight();
    // Cap contentWidth at Ink's stdout columns to prevent text overflow/clipping.
    // In tests, Ink renders at 100 columns while process.stdout.columns may differ.
    const { stdout: inkStdout } = useStdout();
    const renderWidth = inkStdout && 'columns' in inkStdout
        ? inkStdout.columns ?? width
        : width;
    const contentWidth = Math.min(tier === 'wide' ? Math.min(width, 120) : tier === 'normal' ? Math.min(width, 80) : width, renderWidth);
    // Prefer lead/coordinator for first-run hint, fall back to first agent
    const leadAgent = welcome?.agents.find(a => a.role?.toLowerCase().includes('lead') ||
        a.role?.toLowerCase().includes('coordinator') ||
        a.role?.toLowerCase().includes('architect'))?.name ?? welcome?.agents[0]?.name;
    // Determine ThinkingIndicator phase based on SDK connection state
    const thinkingPhase = !onDispatch ? 'connecting' : 'routing';
    // Derive @mention hint from last user message.
    const mentionHint = useMemo(() => {
        if (!processing)
            return undefined;
        const lastUser = [...messages].reverse().find(m => m.role === 'user');
        if (lastUser) {
            const atMatch = lastUser.content.match(/^@(\w+)/);
            if (atMatch?.[1])
                return `${atMatch[1]} is thinking...`;
        }
        return undefined;
    }, [messages, processing]);
    // True when there is prior conversation history (at least one agent response).
    const hasConversation = useMemo(() => messages.some(m => m.role === 'agent'), [messages]);
    // Only archived (overflow) messages go to Static scrollback.
    // Current messages stay in the live region so the user can always see
    // the recent conversation without scrolling. This prevents the
    // "conversation vanishes" problem where every re-render forced the
    // viewport to the bottom, hiding Static scrollback content.
    const staticMessages = archivedMessages;
    const roleMap = useMemo(() => new Map((agents ?? []).map(a => [a.name, a.role])), [agents]);
    // Memoize the header box — rendered once into Static scroll buffer at the top.
    const headerElement = useMemo(() => {
        const brand = getBrand();
        const accent = brand.accentColor;
        const warn = brand.warnColor;
        const borderColor = brand.bannerBorderColor || accent;
        // Cast to Ink's accepted border-style strings; bad values fall back to "single".
        const borderStyle = brand.bannerBorderStyle;
        const showBorder = brand.bannerBorderStyle !== 'none';
        const issuesSuffix = brand.issuesUrl ? ` — file issues at ${brand.issuesUrl}` : '';
        // Narrow: minimal header, no border
        if (tier === 'narrow') {
            return (_jsxs(Box, { flexDirection: "column", paddingX: 1, children: [_jsx(Text, { bold: true, color: noColor ? undefined : accent, children: brand.nameUpper }), _jsxs(Text, { dimColor: true, children: ["v", version] }), _jsx(Text, { color: noColor ? undefined : warn, dimColor: true, children: "\u26A0\uFE0F  Experimental" })] }));
        }
        // Normal: abbreviated header
        if (tier === 'normal') {
            const boxProps = showBorder
                ? { borderStyle, borderColor: noColor ? undefined : borderColor }
                : {};
            return (_jsxs(Box, { flexDirection: "column", ...boxProps, paddingX: 1, children: [_jsxs(Text, { bold: true, color: noColor ? undefined : accent, children: [brand.nameUpper, " v", version] }), _jsx(Text, { dimColor: true, children: brand.hintFull }), _jsx(Text, { color: noColor ? undefined : warn, dimColor: true, children: "\u26A0\uFE0F  Experimental preview" })] }));
        }
        // Wide: full ASCII art header
        const wideBoxProps = showBorder
            ? { borderStyle, borderColor: noColor ? undefined : borderColor }
            : {};
        // Rainbow banner: one solid color per row, cycling red→orange→yellow→green→blue→purple.
        // Matches the pattern used by the pwagent CLI banner (banner.ts RAINBOW array).
        const RAINBOW_HEX = [
            '#FF4040', // red
            '#FF8C00', // orange
            '#FFD700', // yellow
            '#40C860', // green
            '#409CFF', // blue
            '#AA60FF', // purple
        ];
        const rainbowLines = brand.bannerArt
            ? brand.bannerArt.split('\n').map((line, li) => noColor
                ? _jsx(Text, { bold: true, children: line }, li)
                : _jsx(Text, { bold: true, color: RAINBOW_HEX[li % RAINBOW_HEX.length], children: line }, li))
            : null;
        return (_jsxs(Box, { flexDirection: "column", ...wideBoxProps, paddingX: 1, children: [rainbowLines && _jsx(Box, { flexDirection: "column", children: rainbowLines }), _jsx(Text, { children: ' ' }), _jsxs(Text, { dimColor: true, children: ["v", version, " \u00B7 ", brand.hintFull] }), _jsxs(Text, { color: noColor ? undefined : warn, dimColor: true, children: ["\u26A0\uFE0F  Experimental preview", issuesSuffix] })] }));
    }, [noColor, version, tier]);
    const firstRunElement = useMemo(() => {
        if (!welcome?.isFirstRun)
            return null;
        return (_jsx(Box, { flexDirection: "column", paddingX: 1, paddingY: 1, children: rosterAgents.length > 0 ? (_jsxs(_Fragment, { children: [_jsx(Text, { color: noColor ? undefined : 'green', bold: true, children: "Your squad is assembled." }), _jsx(Text, { children: " " }), _jsxs(Text, { bold: true, children: ["Try: ", _jsx(Text, { bold: true, color: noColor ? undefined : 'cyan', children: "What should we build first?" })] }), _jsx(Text, { dimColor: true, children: "Squad automatically routes your message to the best agent." }), _jsxs(Text, { dimColor: true, children: ["Or use ", _jsxs(Text, { bold: true, children: ["@", leadAgent] }), " to message an agent directly."] })] })) : null }));
    }, [welcome?.isFirstRun, rosterAgents, noColor, leadAgent]);
    const allStaticItems = useMemo(() => {
        const items = [{ kind: 'header', key: 'welcome-header' }];
        for (let i = 0; i < staticMessages.length; i++) {
            // Use timestamp + index-at-creation for stable keys that don't shift
            // when new messages are added (array only grows via append)
            const msg = staticMessages[i];
            const stableKey = `${sessionId}-${msg.timestamp.getTime()}-${i}`;
            items.push({ kind: 'msg', key: stableKey, msg, idx: i });
        }
        return items;
    }, [staticMessages, sessionId]);
    // Derive maxVisible from terminal height so taller terminals show more
    // conversation context. Reserve ~8 rows for header/input/agent-panel chrome.
    const maxVisible = Math.max(Math.floor((terminalHeight - 8) / 3), 3);
    return (_jsxs(Box, { flexDirection: "column", children: [_jsx(Static, { items: allStaticItems, children: (item) => {
                    if (item.kind === 'header') {
                        return (_jsxs(Box, { flexDirection: "column", marginBottom: 1, children: [headerElement, firstRunElement] }, item.key));
                    }
                    const { msg, idx: i } = item;
                    const isNewTurn = msg.role === 'user' && i > 0;
                    const agentRole = msg.agentName ? roleMap.get(msg.agentName) : undefined;
                    const emoji = agentRole ? getRoleEmoji(agentRole) : '';
                    let duration = null;
                    if (msg.role === 'agent') {
                        for (let j = i - 1; j >= 0; j--) {
                            if (staticMessages[j]?.role === 'user') {
                                duration = formatDuration(staticMessages[j].timestamp, msg.timestamp);
                                break;
                            }
                        }
                    }
                    return (_jsxs(Box, { flexDirection: "column", width: contentWidth, children: [isNewTurn && tier !== 'narrow' && _jsx(Separator, { marginTop: 1 }), _jsx(Box, { paddingLeft: msg.role === 'user' ? 0 : 2, children: msg.role === 'user' ? (_jsxs(Box, { flexDirection: "column", children: [_jsxs(Box, { children: [_jsx(Text, { color: noColor ? undefined : 'cyan', bold: true, children: "\u276F " }), _jsx(Text, { color: noColor ? undefined : 'cyan', wrap: "wrap", children: msg.content.split('\n')[0] ?? '' })] }), msg.content.split('\n').slice(1).map((line, li) => (_jsx(Box, { paddingLeft: 2, children: _jsx(Text, { color: noColor ? undefined : 'cyan', wrap: "wrap", children: line }) }, li)))] })) : msg.role === 'system' ? (_jsx(Text, { dimColor: true, wrap: "wrap", children: msg.content })) : (_jsxs(_Fragment, { children: [_jsxs(Text, { color: noColor ? undefined : 'green', bold: true, children: [emoji ? `${emoji} ` : '', resolveAgentLabel(msg.agentName), ": "] }), _jsx(Text, { wrap: "wrap", children: renderMarkdownInline(msg.content) }), duration && _jsxs(Text, { dimColor: true, children: [" (", duration, ")"] })] })) })] }, item.key));
                } }), _jsxs(Box, { flexDirection: "column", children: [_jsx(AgentPanel, { agents: agents, streamingContent: streamingContent }), _jsx(MessageStream, { messages: messages, agents: agents, streamingContent: streamingContent, processing: processing, activityHint: activityHint || mentionHint, agentActivities: agentActivities, thinkingPhase: thinkingPhase, maxVisible: maxVisible, hasConversation: hasConversation })] }), _jsx(Box, { marginTop: 1, borderStyle: noColor ? undefined : 'round', borderColor: noColor ? undefined : 'cyan', paddingX: 1, children: _jsx(InputPrompt, { onSubmit: handleSubmit, disabled: processing, agents: welcome?.agents ? welcome.agents.map(a => ({ name: a.name, description: a.role })) : agents.map(a => ({ name: a.name, description: a.role })), messageCount: messages.length }) })] }));
};
//# sourceMappingURL=App.js.map