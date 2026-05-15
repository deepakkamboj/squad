/**
 * React ErrorBoundary for the Ink shell.
 *
 * Catches unhandled errors in the component tree and shows a friendly
 * message instead of a raw stack trace. Logs the error to stderr for debugging.
 */
import React from 'react';
interface ErrorBoundaryProps {
    children: React.ReactNode;
}
interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}
export declare class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps);
    static getDerivedStateFromError(error: Error): ErrorBoundaryState;
    componentDidCatch(error: Error, info: React.ErrorInfo): void;
    render(): React.ReactNode;
}
export {};
//# sourceMappingURL=ErrorBoundary.d.ts.map