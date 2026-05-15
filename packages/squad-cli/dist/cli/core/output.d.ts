/**
 * Color and emoji output utilities — zero dependencies
 */
export declare const GREEN = "\u001B[32m";
export declare const RED = "\u001B[31m";
export declare const YELLOW = "\u001B[33m";
export declare const GRAY = "\u001B[90m";
export declare const DIM = "\u001B[2m";
export declare const BOLD = "\u001B[1m";
export declare const RESET = "\u001B[0m";
/**
 * Print success message with green checkmark
 */
export declare function success(msg: string): void;
/**
 * Print error message with red cross
 */
export declare function error(msg: string): void;
/**
 * Print warning message with yellow warning sign
 */
export declare function warn(msg: string): void;
/**
 * Print info message
 */
export declare function info(msg: string): void;
/**
 * Print secondary text (gray, higher contrast than DIM)
 */
export declare function secondary(msg: string): void;
/**
 * Print dimmed text
 */
export declare function dim(msg: string): void;
/**
 * Print bold text
 */
export declare function bold(msg: string): void;
//# sourceMappingURL=output.d.ts.map