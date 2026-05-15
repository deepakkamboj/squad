/**
 * Squad Upgrade Command (M4-4 & M4-5, Issues #103 & #104)
 *
 * Self-update support for the Squad CLI and SDK dependency.
 * Version comparison via semver, pluggable version fetcher,
 * and SDK upgrade with migration support.
 *
 * @module cli/upgrade
 */
import { MigrationRegistry } from '@bradygaster/squad-sdk/config';
/** Release channel for updates. */
export type ReleaseChannel = 'stable' | 'preview' | 'insider';
/** Information about an available update. */
export interface UpdateInfo {
    /** New version available */
    newVersion: string;
    /** URL to the release page */
    releaseUrl: string;
    /** Changelog / release notes */
    changelog: string;
}
/** Options for performing an upgrade. */
export interface UpgradeOptions {
    /** Force upgrade even if already on latest */
    force?: boolean;
    /** Simulate without applying changes */
    dryRun?: boolean;
    /** Release channel to pull from */
    channel?: ReleaseChannel;
}
/** Result of an upgrade operation. */
export interface UpgradeResult {
    /** Whether the upgrade succeeded */
    success: boolean;
    /** Version we upgraded from */
    fromVersion: string;
    /** Version we upgraded to */
    toVersion: string;
    /** Summary of changes applied */
    changes: string[];
}
/** Options specific to SDK upgrades (--sdk flag). */
export interface SDKUpgradeOptions {
    /** Force upgrade even if already on latest */
    force?: boolean;
    /** Simulate without applying changes */
    dryRun?: boolean;
    /** Release channel */
    channel?: ReleaseChannel;
    /** MigrationRegistry for config migrations between SDK versions */
    migrationRegistry?: MigrationRegistry;
}
/** Result of an SDK upgrade operation. */
export interface SDKUpgradeResult {
    /** Whether the upgrade succeeded */
    success: boolean;
    /** Previous SDK version */
    fromVersion: string;
    /** New SDK version */
    toVersion: string;
    /** Changes applied */
    changes: string[];
    /** Migration steps applied (if config schema changed) */
    migrationSteps: string[];
}
/**
 * Pluggable version fetcher.
 * Consumers replace this to wire in their own registry/network logic.
 */
export type VersionFetcher = (channel: ReleaseChannel) => Promise<string>;
/**
 * Pluggable package.json reader for SDK upgrades.
 */
export type PackageJsonReader = (projectDir: string) => Promise<{
    version: string;
    dependencies?: Record<string, string>;
}>;
/**
 * Pluggable package.json writer for SDK upgrades.
 */
export type PackageJsonWriter = (projectDir: string, version: string) => Promise<void>;
/** Register a custom version fetcher. */
export declare function setVersionFetcher(fn: VersionFetcher): void;
/** Register a custom package.json reader. */
export declare function setPackageJsonReader(fn: PackageJsonReader): void;
/** Register a custom package.json writer. */
export declare function setPackageJsonWriter(fn: PackageJsonWriter): void;
interface ParsedVersion {
    major: number;
    minor: number;
    patch: number;
    prerelease: string;
    raw: string;
}
/**
 * Parse a version string into components.
 * Supports optional pre-release suffix (e.g. "1.2.3-alpha.0").
 */
export declare function parseVersion(version: string): ParsedVersion;
/**
 * Compare two version strings.
 * @returns negative if a < b, 0 if equal, positive if a > b
 */
export declare function compareVersions(a: string, b: string): number;
/** Returns true when `candidate` is newer than `current`. */
export declare function isNewer(current: string, candidate: string): boolean;
/**
 * Fetch the latest version string for the given channel.
 * Delegates to the pluggable VersionFetcher.
 */
export declare function getLatestVersion(channel?: ReleaseChannel): Promise<string>;
/**
 * Check whether an update is available for the CLI.
 *
 * @param currentVersion - Currently installed version
 * @param channel - Release channel (default: stable)
 * @returns UpdateInfo if a newer version exists, otherwise null
 */
export declare function checkForUpdate(currentVersion: string, channel?: ReleaseChannel): Promise<UpdateInfo | null>;
/**
 * Perform a CLI self-upgrade.
 *
 * @param info - UpdateInfo from checkForUpdate
 * @param currentVersion - Currently running version
 * @param options - Upgrade options
 * @returns UpgradeResult describing the outcome
 */
export declare function performUpgrade(info: UpdateInfo, currentVersion: string, options?: UpgradeOptions): Promise<UpgradeResult>;
/**
 * Upgrade the @bradygaster/squad SDK dependency in a project.
 *
 * Reads the project's package.json, compares the installed SDK version
 * to the latest available, and optionally runs config migrations.
 *
 * @param projectDir - Path to the project root (containing package.json)
 * @param options - SDK upgrade options
 * @returns SDKUpgradeResult
 */
export declare function upgradeSDK(projectDir: string, options?: SDKUpgradeOptions): Promise<SDKUpgradeResult>;
export {};
//# sourceMappingURL=upgrade.d.ts.map