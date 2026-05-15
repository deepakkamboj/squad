import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Box, Text, useInput } from 'ink';
import { getBrand } from '../../brand.js';
import { isNoColor, useTerminalWidth } from '../terminal.js';
import { createCompleter, getSuggestions, type Suggestion, type AgentInfo } from '../autocomplete.js';

interface InputPromptProps {
  onSubmit: (value: string) => void;
  prompt?: string;
  disabled?: boolean;
  agents?: AgentInfo[];
  /** Number of messages exchanged so far — drives progressive hint text. */
  messageCount?: number;
}

/** Return context-appropriate placeholder hint based on session progress. */
function getHintText(messageCount: number, narrow: boolean): string {
  if (messageCount < 10) {
    return narrow ? ' Tab · ↑↓ history' : ' Tab completes · ↑↓ history';
  }
  return narrow ? ' /status · /clear · /export' : ' /status · /clear · /export';
}

const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
const MAX_VISIBLE_SUGGESTIONS = 8;
const LABEL_COL_WIDTH = 20;

interface SuggestionBoxProps {
  suggestions: Suggestion[];
  selectedIndex: number;
  accent: string;
  noColor: boolean;
  terminalWidth: number;
}

const SuggestionBox: React.FC<SuggestionBoxProps> = ({ suggestions, selectedIndex, accent, noColor, terminalWidth }) => {
  const visible = suggestions.slice(0, MAX_VISIBLE_SUGGESTIONS);
  const overflow = suggestions.length - MAX_VISIBLE_SUGGESTIONS;
  // Leave room for prefix (3) + label col + 2 padding + description
  const descMaxLen = Math.max(0, terminalWidth - LABEL_COL_WIDTH - 8);

  return (
    <Box flexDirection="column">
      {visible.map((s, i) => {
        const selected = i === selectedIndex;
        const label = s.label.trimEnd().padEnd(LABEL_COL_WIDTH);
        const desc = s.description ? s.description.slice(0, descMaxLen) : '';
        const color = selected && !noColor ? accent : undefined;
        const dim = !selected;
        return (
          <Box key={s.label}>
            <Text color={color} dimColor={dim} bold={selected}>
              {selected ? ' › ' : '   '}{label}
            </Text>
            {desc ? <Text dimColor>{desc}</Text> : null}
          </Box>
        );
      })}
      {overflow > 0 && (
        <Text dimColor>   … {overflow} more — keep typing to filter</Text>
      )}
    </Box>
  );
};

export const InputPrompt: React.FC<InputPromptProps> = ({
  onSubmit,
  prompt = '> ',
  disabled = false,
  agents = [],
  messageCount = 0,
}) => {
  const noColor = isNoColor();
  const width = useTerminalWidth();
  const narrow = width < 60;
  const [value, setValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [spinFrame, setSpinFrame] = useState(0);
  const [bufferDisplay, setBufferDisplay] = useState('');
  const bufferRef = useRef('');
  const wasDisabledRef = useRef(disabled);
  const pendingInputRef = useRef<string[]>([]);
  const pasteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const valueRef = useRef('');

  // Suggestion state
  const [suggestionIndex, setSuggestionIndex] = useState(-1);
  const suggestionIndexRef = useRef(-1);
  const [dismissed, setDismissed] = useState(false);
  const dismissedRef = useRef(false);

  const setSuggIdx = (idx: number) => {
    suggestionIndexRef.current = idx;
    setSuggestionIndex(idx);
  };

  const dismiss = () => {
    dismissedRef.current = true;
    setDismissed(true);
    setSuggIdx(-1);
  };

  const resetDismiss = () => {
    if (dismissedRef.current) {
      dismissedRef.current = false;
      setDismissed(false);
    }
  };

  // Suggestions derived from current value; kept in a ref so useInput can read them synchronously
  const suggestions = useMemo(
    () => (disabled ? [] : getSuggestions(value, agents)),
    [value, agents, disabled],
  );
  const suggestionsRef = useRef<Suggestion[]>([]);
  suggestionsRef.current = suggestions;

  const showSuggestions = !dismissed && suggestions.length > 0;

  // When transitioning from disabled → enabled, restore buffered input
  useEffect(() => {
    if (wasDisabledRef.current && !disabled) {
      if (pasteTimerRef.current) {
        clearTimeout(pasteTimerRef.current);
        pasteTimerRef.current = null;
      }
      const pending = pendingInputRef.current.join('');
      pendingInputRef.current = [];
      const combined = bufferRef.current + pending;
      if (combined) {
        valueRef.current = combined;
        setValue(combined);
        bufferRef.current = '';
        setBufferDisplay('');
      } else {
        valueRef.current = '';
      }
    }
    wasDisabledRef.current = disabled;
  }, [disabled]);

  const completer = useMemo(() => createCompleter(agents), [agents]);

  // Tab-cycling state (used when no suggestion box is shown)
  const tabMatchesRef = useRef<string[]>([]);
  const tabIndexRef = useRef(0);
  const tabPrefixRef = useRef('');

  // Spinner animation
  useEffect(() => {
    if (!disabled || noColor) return;
    const timer = setInterval(() => {
      setSpinFrame(f => (f + 1) % SPINNER_FRAMES.length);
    }, 150);
    return () => clearInterval(timer);
  }, [disabled, noColor]);

  useEffect(() => {
    return () => {
      if (pasteTimerRef.current) clearTimeout(pasteTimerRef.current);
    };
  }, []);

  useInput((input, key) => {
    if (disabled) {
      if (key.return && bufferRef.current.trimStart().startsWith('/')) {
        const cmd = bufferRef.current.trim();
        bufferRef.current = '';
        setBufferDisplay('');
        pendingInputRef.current = [];
        onSubmit(cmd);
        return;
      }
      if (key.return) {
        bufferRef.current += '\n';
        setBufferDisplay(bufferRef.current);
        return;
      }
      if (key.upArrow || key.downArrow || key.ctrl || key.meta) return;
      if (key.backspace || key.delete) {
        bufferRef.current = bufferRef.current.slice(0, -1);
        setBufferDisplay(bufferRef.current);
        return;
      }
      if (input) {
        pendingInputRef.current.push(input);
        bufferRef.current += input;
        setBufferDisplay(bufferRef.current);
      }
      return;
    }

    if (wasDisabledRef.current && pendingInputRef.current.length > 0) {
      pendingInputRef.current.push(input || '');
      return;
    }

    // Escape — dismiss suggestion box
    if (key.escape) {
      if (suggestionsRef.current.length > 0 && !dismissedRef.current) {
        dismiss();
        return;
      }
      return;
    }

    // Enter — select highlighted suggestion OR submit
    if (key.return) {
      if (suggestionIndexRef.current >= 0 && suggestionsRef.current.length > 0) {
        const sel = suggestionsRef.current[suggestionIndexRef.current];
        if (sel) {
          valueRef.current = sel.label;
          setValue(sel.label);
          setSuggIdx(-1);
          // Keep dismissed=false so new suggestions appear (e.g. @agent has trailing space → no suggestions)
        }
        return;
      }
      // Normal submit
      if (pasteTimerRef.current) clearTimeout(pasteTimerRef.current);
      valueRef.current += '\n';
      pasteTimerRef.current = setTimeout(() => {
        pasteTimerRef.current = null;
        const submitVal = valueRef.current.trim();
        if (submitVal) {
          onSubmit(submitVal);
          setHistory(prev => [...prev, submitVal]);
          setHistoryIndex(-1);
        }
        valueRef.current = '';
        setValue('');
        setSuggIdx(-1);
        dismissedRef.current = false;
        setDismissed(false);
      }, 10);
      return;
    }

    if (key.backspace || key.delete) {
      valueRef.current = valueRef.current.slice(0, -1);
      setValue(valueRef.current);
      resetDismiss();
      setSuggIdx(-1);
      return;
    }

    // Arrow keys — navigate suggestions if visible, else navigate history
    if (key.upArrow) {
      if (!dismissedRef.current && suggestionsRef.current.length > 0) {
        const n = suggestionsRef.current.length;
        const cur = suggestionIndexRef.current;
        // First press enters the list at the top (index 0); subsequent presses wrap upward
        setSuggIdx(cur < 0 ? 0 : cur === 0 ? n - 1 : cur - 1);
        return;
      }
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        valueRef.current = history[newIndex]!;
        setValue(history[newIndex]!);
      }
      return;
    }

    if (key.downArrow) {
      if (!dismissedRef.current && suggestionsRef.current.length > 0) {
        const n = suggestionsRef.current.length;
        setSuggIdx((suggestionIndexRef.current + 1) % n);
        return;
      }
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= history.length) {
          setHistoryIndex(-1);
          valueRef.current = '';
          setValue('');
        } else {
          setHistoryIndex(newIndex);
          valueRef.current = history[newIndex]!;
          setValue(history[newIndex]!);
        }
      }
      return;
    }

    // Tab — select suggestion if box is open, else cycle old-style completions
    if (key.tab) {
      if (!dismissedRef.current && suggestionsRef.current.length > 0) {
        const idx = suggestionIndexRef.current >= 0 ? suggestionIndexRef.current : 0;
        const sel = suggestionsRef.current[idx];
        if (sel) {
          valueRef.current = sel.label;
          setValue(sel.label);
          setSuggIdx(-1);
        }
        return;
      }
      // Fallback: old Tab-cycling
      if (tabPrefixRef.current !== value) {
        tabPrefixRef.current = value;
        tabIndexRef.current = 0;
        const [matches] = completer(value);
        tabMatchesRef.current = matches;
      } else {
        if (tabMatchesRef.current.length > 0) {
          tabIndexRef.current = (tabIndexRef.current + 1) % tabMatchesRef.current.length;
        }
      }
      if (tabMatchesRef.current.length > 0) {
        valueRef.current = tabMatchesRef.current[tabIndexRef.current]!;
        setValue(tabMatchesRef.current[tabIndexRef.current]!);
      }
      return;
    }

    // Reset tab state and suggestion selection on any regular key
    tabMatchesRef.current = [];
    tabPrefixRef.current = '';

    if (input && !key.ctrl && !key.meta) {
      valueRef.current += input;
      setValue(valueRef.current);
      setSuggIdx(-1);
      resetDismiss();
    }
  });

  const brand = getBrand();
  const accent = brand.accentColor;

  if (disabled) {
    return (
      <Box flexDirection="column">
        <Box>
          {noColor ? (
            <>
              <Text bold>{narrow ? brand.narrowPrompt : brand.prompt}</Text>
              <Text>[working...]</Text>
              {bufferDisplay ? <Text> {bufferDisplay}</Text> : null}
            </>
          ) : (
            <>
              <Text color={accent} bold>{narrow ? brand.narrowPrompt : brand.prompt}</Text>
              <Text color={accent}>{SPINNER_FRAMES[spinFrame]}</Text>
              {bufferDisplay ? <Text dimColor>{bufferDisplay}</Text> : null}
            </>
          )}
        </Box>
        {!bufferDisplay && <Text dimColor>[working...]</Text>}
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      {showSuggestions && (
        <SuggestionBox
          suggestions={suggestions}
          selectedIndex={suggestionIndex}
          accent={noColor ? '' : accent}
          noColor={noColor}
          terminalWidth={width}
        />
      )}
      <Box>
        <Text color={noColor ? undefined : accent} bold>{narrow ? brand.narrowPrompt : brand.prompt}</Text>
        <Text>{value}</Text>
        <Text color={noColor ? undefined : accent} bold>▌</Text>
      </Box>
      {!value && !showSuggestions && (
        <Text dimColor>{getHintText(messageCount, narrow)}</Text>
      )}
      {showSuggestions && (
        <Text dimColor>  ↑↓ navigate · Tab/Enter select · Esc dismiss</Text>
      )}
    </Box>
  );
};
