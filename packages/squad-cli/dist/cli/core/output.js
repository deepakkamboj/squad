/**
 * Color and emoji output utilities — zero dependencies
 */
// ANSI color codes
export const GREEN = '\x1b[32m';
export const RED = '\x1b[31m';
export const YELLOW = '\x1b[33m';
export const GRAY = '\x1b[90m';
export const DIM = '\x1b[2m';
export const BOLD = '\x1b[1m';
export const RESET = '\x1b[0m';
/**
 * Print success message with green checkmark
 */
export function success(msg) {
    console.log(`${GREEN}✓${RESET} ${msg}`);
}
/**
 * Print error message with red cross
 */
export function error(msg) {
    console.error(`${RED}✗${RESET} ${msg}`);
}
/**
 * Print warning message with yellow warning sign
 */
export function warn(msg) {
    console.log(`${YELLOW}⚠️${RESET} ${msg}`);
}
/**
 * Print info message
 */
export function info(msg) {
    console.log(msg);
}
/**
 * Print secondary text (gray, higher contrast than DIM)
 */
export function secondary(msg) {
    console.log(`${GRAY}${msg}${RESET}`);
}
/**
 * Print dimmed text
 */
export function dim(msg) {
    console.log(`${DIM}${msg}${RESET}`);
}
/**
 * Print bold text
 */
export function bold(msg) {
    console.log(`${BOLD}${msg}${RESET}`);
}
//# sourceMappingURL=output.js.map