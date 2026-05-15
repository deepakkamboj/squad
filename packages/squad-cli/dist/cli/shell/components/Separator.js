import { jsx as _jsx } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import { detectTerminal, boxChars, getTerminalWidth } from '../terminal.js';
export const Separator = ({ width, marginTop = 0, marginBottom = 0 }) => {
    const caps = detectTerminal();
    const box = boxChars(caps);
    const w = width ?? Math.min(getTerminalWidth(), 80) - 2;
    return (_jsx(Box, { marginTop: marginTop, marginBottom: marginBottom, children: _jsx(Text, { dimColor: true, children: box.h.repeat(Math.max(w, 0)) }) }));
};
//# sourceMappingURL=Separator.js.map