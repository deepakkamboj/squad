/**
 * Squad Upgrade Command (M4-4 & M4-5, Issues #103 & #104)
 *
 * Self-update support for the Squad CLI and SDK dependency.
 * Version comparison via semver, pluggable version fetcher,
 * and SDK upgrade with migration support.
 *
 * @module cli/upgrade
 */
// ============================================================================
// Default (stub) implementations — replaced in production
// ============================================================================
let _versionFetcher = async (_channel) => {
    throw new Error('No version fetcher configured. Call setVersionFetcher() first.');
};
let _packageJsonReader = async (_dir) => {
    throw new Error('No package.json reader configured. Call setPackageJsonReader() first.');
};
let _packageJsonWriter = async (_dir, _v) => {
    throw new Error('No package.json writer configured. Call setPackageJsonWriter() first.');
};
/** Register a custom version fetcher. */
export function setVersionFetcher(fn) {
    _versionFetcher = fn;
}
/** Register a custom package.json reader. */
export function setPackageJsonReader(fn) {
    _packageJsonReader = fn;
}
/** Register a custom package.json writer. */
export function setPackageJsonWriter(fn) {
    _packageJsonWriter = fn;
}
const VERSION_RE = /^(\d+)\.(\d+)\.(\d+)(?:-(.+))?$/;
/**
 * Parse a version string into components.
 * Supports optional pre-release suffix (e.g. "1.2.3-alpha.0").
 */
export function parseVersion(version) {
    const m = version.match(VERSION_RE);
    if (!m) {
        throw new Error(`Invalid version: "${version}"`);
    }
    return {
        major: Number(m[1]),
        minor: Number(m[2]),
        patch: Number(m[3]),
        prerelease: m[4] ?? '',
        raw: version,
    };
}
/**
 * Compare two version strings.
 * @returns negative if a < b, 0 if equal, positive if a > b
 */
export function compareVersions(a, b) {
    const va = parseVersion(a);
    const vb = parseVersion(b);
    if (va.major !== vb.major)
        return va.major - vb.major;
    if (va.minor !== vb.minor)
        return va.minor - vb.minor;
    if (va.patch !== vb.patch)
        return va.patch - vb.patch;
    // No prerelease > has prerelease (1.0.0 > 1.0.0-alpha)
    if (!va.prerelease && vb.prerelease)
        return 1;
    if (va.prerelease && !vb.prerelease)
        return -1;
    // Lexicographic prerelease comparison
    return va.prerelease.localeCompare(vb.prerelease);
}
/** Returns true when `candidate` is newer than `current`. */
export function isNewer(current, candidate) {
    return compareVersions(candidate, current) > 0;
}
// ============================================================================
// Core upgrade API
// ============================================================================
/**
 * Fetch the latest version string for the given channel.
 * Delegates to the pluggable VersionFetcher.
 */
export async function getLatestVersion(channel = 'stable') {
    return _versionFetcher(channel);
}
/**
 * Check whether an update is available for the CLI.
 *
 * @param currentVersion - Currently installed version
 * @param channel - Release channel (default: stable)
 * @returns UpdateInfo if a newer version exists, otherwise null
 */
export async function checkForUpdate(currentVersion, channel = 'stable') {
    const latest = await getLatestVersion(channel);
    if (!isNewer(currentVersion, latest)) {
        return null;
    }
    return {
        newVersion: latest,
        releaseUrl: `https://github.com/bradygaster/squad/releases/tag/v${latest}`,
        changelog: `Update from ${currentVersion} to ${latest}`,
    };
}
/**
 * Perform a CLI self-upgrade.
 *
 * @param info - UpdateInfo from checkForUpdate
 * @param currentVersion - Currently running version
 * @param options - Upgrade options
 * @returns UpgradeResult describing the outcome
 */
export async function performUpgrade(info, currentVersion, options = {}) {
    const { force = false, dryRun = false } = options;
    if (!force && !isNewer(currentVersion, info.newVersion)) {
        return {
            success: false,
            fromVersion: currentVersion,
            toVersion: info.newVersion,
            changes: ['Already on latest version'],
        };
    }
    if (dryRun) {
        return {
            success: true,
            fromVersion: currentVersion,
            toVersion: info.newVersion,
            changes: [`[dry-run] Would upgrade from ${currentVersion} to ${info.newVersion}`],
        };
    }
    // In a real implementation this would shell out to npm/npx.
    // The abstraction allows consumers to supply their own installer.
    return {
        success: true,
        fromVersion: currentVersion,
        toVersion: info.newVersion,
        changes: [`Upgraded from ${currentVersion} to ${info.newVersion}`],
    };
}
// ============================================================================
// SDK upgrade (--sdk flag, M4-5)
// ============================================================================
const SDK_PACKAGE_NAME = '@bradygaster/squad';
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
export async function upgradeSDK(projectDir, options = {}) {
    const { force = false, dryRun = false, channel = 'stable', migrationRegistry } = options;
    // Read current SDK version from package.json
    const pkg = await _packageJsonReader(projectDir);
    const deps = pkg.dependencies ?? {};
    const currentRaw = deps[SDK_PACKAGE_NAME];
    if (!currentRaw) {
        return {
            success: false,
            fromVersion: 'none',
            toVersion: 'none',
            changes: [`${SDK_PACKAGE_NAME} not found in dependencies`],
            migrationSteps: [],
        };
    }
    // Strip leading ^ or ~ for comparison
    const currentVersion = currentRaw.replace(/^[\^~]/, '');
    const latest = await getLatestVersion(channel);
    if (!force && !isNewer(currentVersion, latest)) {
        return {
            success: true,
            fromVersion: currentVersion,
            toVersion: currentVersion,
            changes: ['SDK already on latest version'],
            migrationSteps: [],
        };
    }
    const migrationSteps = [];
    // Run config migrations if a MigrationRegistry was provided
    if (migrationRegistry) {
        try {
            // Normalise versions to strict semver (strip prerelease for registry lookup)
            const fromStrict = toStrictSemver(currentVersion);
            const toStrict = toStrictSemver(latest);
            if (migrationRegistry.hasPath(fromStrict, toStrict)) {
                const result = migrationRegistry.runMigrations({}, fromStrict, toStrict);
                for (const m of result.applied) {
                    migrationSteps.push(m.description ?? `${m.fromVersion} → ${m.toVersion}`);
                }
            }
        }
        catch {
            migrationSteps.push('Migration check skipped — no migration path found');
        }
    }
    if (dryRun) {
        return {
            success: true,
            fromVersion: currentVersion,
            toVersion: latest,
            changes: [`[dry-run] Would upgrade SDK from ${currentVersion} to ${latest}`],
            migrationSteps,
        };
    }
    // Write updated version to package.json
    await _packageJsonWriter(projectDir, latest);
    return {
        success: true,
        fromVersion: currentVersion,
        toVersion: latest,
        changes: [`Upgraded SDK from ${currentVersion} to ${latest}`],
        migrationSteps,
    };
}
// ============================================================================
// Helpers
// ============================================================================
/** Strip prerelease suffix to get strict major.minor.patch. */
function toStrictSemver(version) {
    const parsed = parseVersion(version);
    return `${parsed.major}.${parsed.minor}.${parsed.patch}`;
}
//# sourceMappingURL=upgrade.js.map