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

export interface Brand {
  name: string;
  nameUpper: string;
  bannerArt: string;
  tagline: string;
  prompt: string;
  narrowPrompt: string;
  hintFull: string;
  hintNarrow: string;
  accentColor: string;
  warnColor: string;
  bannerBorderStyle: string;
  bannerBorderColor: string;
  coordinatorAgentName: string;
  issuesUrl: string;
}

const SQUAD_DEFAULT_BANNER_ART =
  '  ___  ___  _   _  _   ___\n / __|/ _ \\| | | |/_\\ |   \\\n \\__ \\ (_) | |_| / _ \\| |) |\n |___/\\__\\_\\\\___/_/ \\_\\___/';

const DEFAULT_BRAND: Brand = {
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

let cached: Brand | undefined;

export function getBrand(cwd: string = process.cwd()): Brand {
  if (cached) return cached;
  let brand: Brand = { ...DEFAULT_BRAND };

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

export function resetBrandCache(): void {
  cached = undefined;
}

export function getDefaultBrand(): Brand {
  return { ...DEFAULT_BRAND };
}

function readJson(path: string): Partial<Brand> {
  try {
    const parsed = JSON.parse(readFileSync(path, 'utf8')) as unknown;
    if (parsed && typeof parsed === 'object') return parsed as Partial<Brand>;
    return {};
  } catch {
    return {};
  }
}

function readEnvOverrides(): Partial<Brand> {
  const env = process.env;
  const overrides: Partial<Brand> = {};
  if (env['SQUAD_BRAND_NAME']) overrides.name = env['SQUAD_BRAND_NAME'];
  if (env['SQUAD_BRAND_NAME_UPPER']) overrides.nameUpper = env['SQUAD_BRAND_NAME_UPPER'];
  if (env['SQUAD_BRAND_BANNER_ART']) overrides.bannerArt = env['SQUAD_BRAND_BANNER_ART'];
  if (env['SQUAD_BRAND_TAGLINE']) overrides.tagline = env['SQUAD_BRAND_TAGLINE'];
  if (env['SQUAD_BRAND_PROMPT']) overrides.prompt = env['SQUAD_BRAND_PROMPT'];
  if (env['SQUAD_BRAND_NARROW_PROMPT']) overrides.narrowPrompt = env['SQUAD_BRAND_NARROW_PROMPT'];
  if (env['SQUAD_BRAND_HINT_FULL']) overrides.hintFull = env['SQUAD_BRAND_HINT_FULL'];
  if (env['SQUAD_BRAND_HINT_NARROW']) overrides.hintNarrow = env['SQUAD_BRAND_HINT_NARROW'];
  if (env['SQUAD_BRAND_ACCENT']) overrides.accentColor = env['SQUAD_BRAND_ACCENT'];
  if (env['SQUAD_BRAND_WARN']) overrides.warnColor = env['SQUAD_BRAND_WARN'];
  if (env['SQUAD_BRAND_BANNER_BORDER_STYLE']) overrides.bannerBorderStyle = env['SQUAD_BRAND_BANNER_BORDER_STYLE'];
  if (env['SQUAD_BRAND_BANNER_BORDER_COLOR']) overrides.bannerBorderColor = env['SQUAD_BRAND_BANNER_BORDER_COLOR'];
  if (env['SQUAD_BRAND_COORDINATOR']) overrides.coordinatorAgentName = env['SQUAD_BRAND_COORDINATOR'];
  if (env['SQUAD_BRAND_ISSUES_URL']) overrides.issuesUrl = env['SQUAD_BRAND_ISSUES_URL'];
  return overrides;
}

function mergeBrand(base: Brand, override: Partial<Brand>): Brand {
  const out: Brand = { ...base };
  for (const k of Object.keys(override) as Array<keyof Brand>) {
    const v = override[k];
    if (typeof v === 'string') {
      (out[k] as string) = v;
    }
  }
  return out;
}
