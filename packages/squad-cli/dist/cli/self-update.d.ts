/**
 * Self-update check — Phase 1: background version check with notification.
 *
 * Non-blocking startup check that queries the npm registry for the latest
 * version of @bradygaster/squad-cli and displays a passive banner when
 * an update is available. Results are cached for 24 hours.
 *
 * Disable with: SQUAD_NO_UPDATE_CHECK=1
 *
 * @module cli/self-update
 */
/**
 * Check for updates and print a banner if a newer version is available.
 *
 * This function is designed to be fire-and-forget: it never throws,
 * never blocks the shell, and silently no-ops on any failure.
 *
 * @param currentVersion - The currently running CLI version
 */
export declare function notifyIfUpdateAvailable(currentVersion: string): Promise<void>;
//# sourceMappingURL=self-update.d.ts.map