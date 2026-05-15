/**
 * squad doctor — setup validation diagnostic command.
 *
 * Inspects the .squad/ directory (or hub layout) and reports
 * the health of every expected file / convention. Always exits 0
 * because this is a diagnostic tool, not a gate.
 *
 * Inspired by @spboyer (Shayne Boyer)'s doctor command in PR bradygaster/squad#131.
 *
 * @module cli/commands/doctor
 */
/** Result of a single diagnostic check. */
export interface DoctorCheck {
    name: string;
    status: 'pass' | 'fail' | 'warn';
    message: string;
    /** Optional severity hint for display; keeps the status union stable. */
    severity?: 'info';
}
/** Detected squad layout mode. */
export type DoctorMode = 'local' | 'remote' | 'hub';
/**
 * Check that Node.js is ≥22.5.0 for node:sqlite availability.
 * Accepts an optional version string for testing.
 */
export declare function checkNodeVersion(nodeVersion?: string): DoctorCheck;
/**
 * Run all doctor checks for the given working directory.
 * Returns an array of check results — never throws for check failures.
 */
export declare function runDoctor(cwd?: string): Promise<DoctorCheck[]>;
/**
 * Detect the squad mode for the given working directory.
 * Exported for tests and display.
 */
export declare function getDoctorMode(cwd?: string): DoctorMode;
/**
 * Print doctor results to stdout. Intended for CLI use.
 */
export declare function printDoctorReport(checks: DoctorCheck[], mode: DoctorMode): void;
/**
 * CLI entry point — run doctor and print results.
 */
export declare function doctorCommand(cwd?: string): Promise<void>;
//# sourceMappingURL=doctor.d.ts.map