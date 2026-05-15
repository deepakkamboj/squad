import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * React ErrorBoundary for the Ink shell.
 *
 * Catches unhandled errors in the component tree and shows a friendly
 * message instead of a raw stack trace. Logs the error to stderr for debugging.
 */
import React from 'react';
import { Box, Text } from 'ink';
export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, info) {
        console.error('[squad] Unhandled UI error:', error);
        if (info.componentStack) {
            console.error('[squad] Component stack:', info.componentStack);
        }
    }
    render() {
        if (this.state.hasError) {
            return (_jsxs(Box, { flexDirection: "column", padding: 1, children: [_jsx(Text, { color: "red", bold: true, children: "Something went wrong. Press Ctrl+C to exit." }), _jsx(Text, { dimColor: true, children: "The error has been logged to stderr for debugging." })] }));
        }
        return this.props.children;
    }
}
//# sourceMappingURL=ErrorBoundary.js.map