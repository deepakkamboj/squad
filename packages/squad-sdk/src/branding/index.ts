/**
 * Squad branding module — pluggable look & feel for the CLI shell.
 *
 * Squad ships with a default "Squad" identity (banner, prompt, accent color,
 * coordinator name). Downstream projects that consume `@bradygaster/squad-cli`
 * or `@bradygaster/squad-sdk` can override any of these via either:
 *
 *   1. Env vars   — SQUAD_BRAND_NAME, SQUAD_BRAND_PROMPT, etc.
 *   2. Config file — squad.brand.json in cwd, .squad/brand.json in cwd, or
 *                    ~/.squad/brand.json globally.
 *   3. Default     — built-in Squad identity (used when nothing overrides).
 *
 * Resolution order (later overrides earlier): default → ~/.squad/brand.json →
 * <cwd>/squad.brand.json → <cwd>/.squad/brand.json → env vars.
 *
 * The CLI shell components call `getBrand()` once per render and substitute
 * the returned strings/colors. No string-mangling or runtime patching needed
 * downstream — just set env vars or drop a brand file.
 *
 * @example Override via env (no code change in the consumer):
 *   SQUAD_BRAND_NAME=pwagent SQUAD_BRAND_PROMPT="◆ pwagent> " squad
 *
 * @example Override via squad.brand.json in the workspace:
 *   {
 *     "name": "pwagent",
 *     "nameUpper": "PWAGENT",
 *     "prompt": "◆ pwagent> ",
 *     "narrowPrompt": "pw> ",
 *     "tagline": "Multi-agent Playwright testing",
 *     "accentColor": "magenta",
 *     "coordinatorAgentName": "pwagent"
 *   }
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

/** Resolved branding for the current process. */
export interface Brand {
  /** Lowercase identifier — appears in the prompt, env var keys, filenames. */
  name: string;
  /** Uppercase variant — appears as the banner header. */
  nameUpper: string;
  /** ASCII art shown in the wide banner. Empty string disables the art block. */
  bannerArt: string;
  /** Tagline shown under the banner. */
  tagline: string;
  /** Full-width prompt label (e.g. "◆ squad> "). */
  prompt: string;
  /** Narrow-terminal prompt label (e.g. "sq> "). */
  narrowPrompt: string;
  /** Hint shown under the prompt at "normal" / wide tiers. */
  hintFull: string;
  /** Compact hint for the "narrow" tier. */
  hintNarrow: string;
  /** Primary accent color (Ink/chalk color name: "cyan", "magenta", etc.). */
  accentColor: string;
  /** Warning / experimental color (Ink/chalk color name). */
  warnColor: string;
  /**
   * Border style around the banner logo. One of Ink's `borderStyle` values:
   * "single" · "double" · "round" · "bold" · "singleDouble" · "doubleSingle" ·
   * "classic" · "none". Default: "round".
   *
   * NOTE: This MUST be a literal Ink BorderStyle name. Custom strings render
   * as "single" silently.
   */
  bannerBorderStyle: string;
  /** Border color around the banner logo. Falls back to accentColor when empty. */
  bannerBorderColor: string;
  /** Frontmatter `name:` for the coordinator manifest at .github/agents/squad.agent.md. */
  coordinatorAgentName: string;
  /** GitHub issues URL shown in the wide banner. Empty disables. */
  issuesUrl: string;
}

const SQUAD_DEFAULT_BANNER_ART =
  "  ___  ___  _   _  _   ___\n / __|/ _ \\| | | |/_\\ |   \\\n \\__ \\ (_) | |_| / _ \\| |) |\n |___/\\__\\_\\\\___/_/ \\_\\___/";

const DEFAULT_BRAND: Brand = {
  name: "squad",
  nameUpper: "SQUAD",
  bannerArt: SQUAD_DEFAULT_BANNER_ART,
  tagline: "Your AI team — multi-agent runtime",
  prompt: "◆ squad> ",
  narrowPrompt: "sq> ",
  hintFull: "Type naturally · @Agent to direct · /help",
  hintNarrow: "Tab completes · ↑↓ history",
  accentColor: "cyan",
  warnColor: "yellow",
  bannerBorderStyle: "round",
  bannerBorderColor: "",
  coordinatorAgentName: "Squad",
  issuesUrl: "github.com/bradygaster/squad",
};

let cached: Brand | undefined;

/**
 * Resolve the current brand. Caches on first call so repeated renders are cheap.
 * Pass a custom cwd for tests or for multi-tenant scenarios.
 */
export function getBrand(cwd: string = process.cwd()): Brand {
  if (cached) return cached;
  let brand: Brand = { ...DEFAULT_BRAND };

  // Layer 2: ~/.squad/brand.json
  const homeBrand = join(homedir(), ".squad", "brand.json");
  if (existsSync(homeBrand)) {
    brand = mergeBrand(brand, readJson(homeBrand));
  }

  // Layer 3: workspace overrides
  for (const candidate of [join(cwd, "squad.brand.json"), join(cwd, ".squad", "brand.json")]) {
    if (existsSync(candidate)) {
      brand = mergeBrand(brand, readJson(candidate));
    }
  }

  // Layer 4: env vars (always win — useful for ephemeral overrides + downstream wrappers)
  brand = mergeBrand(brand, readEnvOverrides());

  // Final coherence pass: if nameUpper is still the default and name has been
  // overridden, derive nameUpper from name. Lets downstream projects set only
  // `SQUAD_BRAND_NAME` and get a sensible banner header for free.
  if (brand.name !== DEFAULT_BRAND.name && brand.nameUpper === DEFAULT_BRAND.nameUpper) {
    brand.nameUpper = brand.name.toUpperCase();
  }

  cached = brand;
  return brand;
}

/**
 * Reset the cache. Useful in tests and when env vars / config files change
 * mid-process (rare but possible in long-running daemons).
 */
export function resetBrandCache(): void {
  cached = undefined;
}

/** Return the default brand without consulting overrides. Useful for fallbacks. */
export function getDefaultBrand(): Brand {
  return { ...DEFAULT_BRAND };
}

function readJson(path: string): Partial<Brand> {
  try {
    const parsed = JSON.parse(readFileSync(path, "utf8")) as unknown;
    if (parsed && typeof parsed === "object") return parsed as Partial<Brand>;
    return {};
  } catch {
    return {};
  }
}

function readEnvOverrides(): Partial<Brand> {
  const env = process.env;
  const overrides: Partial<Brand> = {};
  if (env["SQUAD_BRAND_NAME"]) overrides.name = env["SQUAD_BRAND_NAME"];
  if (env["SQUAD_BRAND_NAME_UPPER"]) overrides.nameUpper = env["SQUAD_BRAND_NAME_UPPER"];
  if (env["SQUAD_BRAND_BANNER_ART"]) overrides.bannerArt = env["SQUAD_BRAND_BANNER_ART"];
  if (env["SQUAD_BRAND_TAGLINE"]) overrides.tagline = env["SQUAD_BRAND_TAGLINE"];
  if (env["SQUAD_BRAND_PROMPT"]) overrides.prompt = env["SQUAD_BRAND_PROMPT"];
  if (env["SQUAD_BRAND_NARROW_PROMPT"]) overrides.narrowPrompt = env["SQUAD_BRAND_NARROW_PROMPT"];
  if (env["SQUAD_BRAND_HINT_FULL"]) overrides.hintFull = env["SQUAD_BRAND_HINT_FULL"];
  if (env["SQUAD_BRAND_HINT_NARROW"]) overrides.hintNarrow = env["SQUAD_BRAND_HINT_NARROW"];
  if (env["SQUAD_BRAND_ACCENT"]) overrides.accentColor = env["SQUAD_BRAND_ACCENT"];
  if (env["SQUAD_BRAND_WARN"]) overrides.warnColor = env["SQUAD_BRAND_WARN"];
  if (env["SQUAD_BRAND_BANNER_BORDER_STYLE"]) overrides.bannerBorderStyle = env["SQUAD_BRAND_BANNER_BORDER_STYLE"];
  if (env["SQUAD_BRAND_BANNER_BORDER_COLOR"]) overrides.bannerBorderColor = env["SQUAD_BRAND_BANNER_BORDER_COLOR"];
  if (env["SQUAD_BRAND_COORDINATOR"]) overrides.coordinatorAgentName = env["SQUAD_BRAND_COORDINATOR"];
  if (env["SQUAD_BRAND_ISSUES_URL"]) overrides.issuesUrl = env["SQUAD_BRAND_ISSUES_URL"];
  return overrides;
}

function mergeBrand(base: Brand, override: Partial<Brand>): Brand {
  const out: Brand = { ...base };
  for (const k of Object.keys(override) as Array<keyof Brand>) {
    const v = override[k];
    if (typeof v === "string") {
      // Cast safe — all Brand fields are strings.
      (out[k] as string) = v;
    }
  }
  return out;
}
