/**
 * Brand resolution for squad-cli.
 *
 * Vendored from @bradygaster/squad-sdk/branding so squad-cli can be installed
 * as a standalone GitHub path dependency without requiring the fork's squad-sdk.
 *
 * Resolution order (later wins): default → ~/.squad/brand.json →
 * <cwd>/squad.brand.json → <cwd>/.<name>/brand.json → <cwd>/.squad/brand.json → env vars.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
const SQUAD_DEFAULT_BANNER_ART = '  ___  ___  _   _  _   ___\n / __|/ _ \\| | | |/_\\ |   \\\n \\__ \\ (_) | |_| / _ \\| |) |\n |___/\\__\\_\\\\___/_/ \\_\\___/';
const DEFAULT_BRAND = {
    name: 'squad',
    nameUpper: 'SQUAD',
    bannerArt: SQUAD_DEFAULT_BANNER_ART,
    tagline: 'Your AI team — multi-agent runtime',
    prompt: '◆ squad> ',
    narrowPrompt: 'sq> ',
    hintFull: 'Type naturally · @Agent to direct · /help',
    hintNarrow: 'Tab completes · ↑↓ history',
    accentColor: 'cyan',
    warnColor: 'yellow',
    bannerBorderStyle: 'round',
    bannerBorderColor: '',
    coordinatorAgentName: 'Squad',
    issuesUrl: 'github.com/bradygaster/squad',
};
let cached;
export function getBrand(cwd = process.cwd()) {
    if (cached)
        return cached;
    let brand = { ...DEFAULT_BRAND };
    const homeBrand = join(homedir(), '.squad', 'brand.json');
    if (existsSync(homeBrand)) {
        brand = mergeBrand(brand, readJson(homeBrand));
    }
    const envName = process.env['SQUAD_BRAND_NAME'];
    const extraDir = envName ? join(cwd, `.${envName}`, 'brand.json') : null;
    const candidates = [
        join(cwd, 'squad.brand.json'),
        ...(extraDir ? [extraDir] : []),
        join(cwd, '.squad', 'brand.json'),
    ];
    for (const candidate of candidates) {
        if (existsSync(candidate)) {
            brand = mergeBrand(brand, readJson(candidate));
        }
    }
    brand = mergeBrand(brand, readEnvOverrides());
    if (brand.name !== DEFAULT_BRAND.name && brand.nameUpper === DEFAULT_BRAND.nameUpper) {
        brand.nameUpper = brand.name.toUpperCase();
    }
    cached = brand;
    return brand;
}
export function resetBrandCache() {
    cached = undefined;
}
export function getDefaultBrand() {
    return { ...DEFAULT_BRAND };
}
function readJson(path) {
    try {
        const parsed = JSON.parse(readFileSync(path, 'utf8'));
        if (parsed && typeof parsed === 'object')
            return parsed;
        return {};
    }
    catch {
        return {};
    }
}
function readEnvOverrides() {
    const env = process.env;
    const overrides = {};
    if (env['SQUAD_BRAND_NAME'])
        overrides.name = env['SQUAD_BRAND_NAME'];
    if (env['SQUAD_BRAND_NAME_UPPER'])
        overrides.nameUpper = env['SQUAD_BRAND_NAME_UPPER'];
    if (env['SQUAD_BRAND_BANNER_ART'])
        overrides.bannerArt = env['SQUAD_BRAND_BANNER_ART'];
    if (env['SQUAD_BRAND_TAGLINE'])
        overrides.tagline = env['SQUAD_BRAND_TAGLINE'];
    if (env['SQUAD_BRAND_PROMPT'])
        overrides.prompt = env['SQUAD_BRAND_PROMPT'];
    if (env['SQUAD_BRAND_NARROW_PROMPT'])
        overrides.narrowPrompt = env['SQUAD_BRAND_NARROW_PROMPT'];
    if (env['SQUAD_BRAND_HINT_FULL'])
        overrides.hintFull = env['SQUAD_BRAND_HINT_FULL'];
    if (env['SQUAD_BRAND_HINT_NARROW'])
        overrides.hintNarrow = env['SQUAD_BRAND_HINT_NARROW'];
    if (env['SQUAD_BRAND_ACCENT'])
        overrides.accentColor = env['SQUAD_BRAND_ACCENT'];
    if (env['SQUAD_BRAND_WARN'])
        overrides.warnColor = env['SQUAD_BRAND_WARN'];
    if (env['SQUAD_BRAND_BANNER_BORDER_STYLE'])
        overrides.bannerBorderStyle = env['SQUAD_BRAND_BANNER_BORDER_STYLE'];
    if (env['SQUAD_BRAND_BANNER_BORDER_COLOR'])
        overrides.bannerBorderColor = env['SQUAD_BRAND_BANNER_BORDER_COLOR'];
    if (env['SQUAD_BRAND_COORDINATOR'])
        overrides.coordinatorAgentName = env['SQUAD_BRAND_COORDINATOR'];
    if (env['SQUAD_BRAND_ISSUES_URL'])
        overrides.issuesUrl = env['SQUAD_BRAND_ISSUES_URL'];
    return overrides;
}
function mergeBrand(base, override) {
    const out = { ...base };
    for (const k of Object.keys(override)) {
        const v = override[k];
        if (typeof v === 'string') {
            out[k] = v;
        }
    }
    return out;
}
//# sourceMappingURL=brand.js.map