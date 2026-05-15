# Branding

Squad's shell (banner, prompt, tagline, accent colors, border around the logo) is configurable via a small **branding module** in `@bradygaster/squad-sdk`. Downstream consumers can rebrand the entire shell without forking, patching files at runtime, or compiling Squad themselves.

Three override layers, last one wins:

1. **Default brand** — built-in Squad identity (banner says "SQUAD", prompt is `◆ squad> `, accent color cyan).
2. **Config files** — JSON at any of: `~/.squad/brand.json`, `<cwd>/squad.brand.json`, `<cwd>/.squad/brand.json`.
3. **Environment variables** — `SQUAD_BRAND_*` always win, useful for ephemeral overrides and downstream wrappers.

---

## The `Brand` shape

```ts
import type { Brand } from "@bradygaster/squad-sdk";

interface Brand {
  /** Lowercase identifier — appears in the prompt, env var keys, filenames. */
  name: string;                  // default: "squad"
  /** Uppercase variant — appears as the banner header. */
  nameUpper: string;             // default: "SQUAD"
  /** ASCII art shown in the wide banner. Empty string disables. */
  bannerArt: string;             // default: built-in Squad ASCII
  /** Tagline shown under the banner. */
  tagline: string;               // default: "Your AI team — multi-agent runtime"
  /** Full-width prompt label. */
  prompt: string;                // default: "◆ squad> "
  /** Narrow-terminal prompt label. */
  narrowPrompt: string;          // default: "sq> "
  /** Hint shown under the prompt at "normal" / wide tiers. */
  hintFull: string;              // default: "Type naturally · @Agent to direct · /help"
  /** Compact hint for the "narrow" tier. */
  hintNarrow: string;            // default: "Tab completes · ↑↓ history"
  /** Primary accent color (Ink/chalk name: cyan · magenta · green · ...). */
  accentColor: string;           // default: "cyan"
  /** Warning / experimental color. */
  warnColor: string;             // default: "yellow"
  /** Border style around the banner. One of: "single" "double" "round" "bold"
   *  "singleDouble" "doubleSingle" "classic" "none". */
  bannerBorderStyle: string;     // default: "round"
  /** Border color around the banner. Empty falls back to accentColor. */
  bannerBorderColor: string;     // default: "" (uses accentColor)
  /** Frontmatter `name:` for the coordinator manifest. */
  coordinatorAgentName: string;  // default: "Squad"
  /** GitHub issues URL shown in the wide banner. Empty disables. */
  issuesUrl: string;             // default: "github.com/bradygaster/squad"
}
```

---

## Override via env vars

Every field has an `SQUAD_BRAND_*` env var. Useful for downstream tools that wrap Squad — they set the env vars before `spawn()`, no config file needed:

```bash
SQUAD_BRAND_NAME=pwagent \
SQUAD_BRAND_NAME_UPPER=PWAGENT \
SQUAD_BRAND_PROMPT="◆ pwagent> " \
SQUAD_BRAND_NARROW_PROMPT="pw> " \
SQUAD_BRAND_ACCENT=magenta \
SQUAD_BRAND_BANNER_BORDER_STYLE=double \
SQUAD_BRAND_TAGLINE="Multi-agent Playwright testing" \
SQUAD_BRAND_ISSUES_URL="github.com/microsoft/pwagent" \
squad
```

Full env-var map:

| Env var | Sets |
|---|---|
| `SQUAD_BRAND_NAME` | `name` (also derives `nameUpper` if not set) |
| `SQUAD_BRAND_NAME_UPPER` | `nameUpper` |
| `SQUAD_BRAND_BANNER_ART` | `bannerArt` (multi-line — use `\n` in shell-escaped form) |
| `SQUAD_BRAND_TAGLINE` | `tagline` |
| `SQUAD_BRAND_PROMPT` | `prompt` |
| `SQUAD_BRAND_NARROW_PROMPT` | `narrowPrompt` |
| `SQUAD_BRAND_HINT_FULL` | `hintFull` |
| `SQUAD_BRAND_HINT_NARROW` | `hintNarrow` |
| `SQUAD_BRAND_ACCENT` | `accentColor` |
| `SQUAD_BRAND_WARN` | `warnColor` |
| `SQUAD_BRAND_BANNER_BORDER_STYLE` | `bannerBorderStyle` |
| `SQUAD_BRAND_BANNER_BORDER_COLOR` | `bannerBorderColor` |
| `SQUAD_BRAND_COORDINATOR` | `coordinatorAgentName` |
| `SQUAD_BRAND_ISSUES_URL` | `issuesUrl` |

---

## Override via config file

Drop a `squad.brand.json` in your workspace, or `.squad/brand.json`, or `~/.squad/brand.json` for a per-user default:

```jsonc
// squad.brand.json
{
  "name": "pwagent",
  "nameUpper": "PWAGENT",
  "tagline": "Multi-agent Playwright testing — Squad design, GitHub Copilot SDK runtime",
  "prompt": "◆ pwagent> ",
  "narrowPrompt": "pw> ",
  "accentColor": "magenta",
  "bannerBorderStyle": "round",
  "bannerBorderColor": "magenta",
  "coordinatorAgentName": "pwagent",
  "issuesUrl": "github.com/microsoft/pwagent",
  "bannerArt": "  ██████╗  ██╗    ██╗  █████╗   ██████╗ ███████╗███╗   ██╗████████╗\n  ██╔══██╗ ██║    ██║ ██╔══██╗ ██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝\n  ██████╔╝ ██║ █╗ ██║ ███████║ ██║  ███╗█████╗  ██╔██╗ ██║   ██║\n  ██╔═══╝  ██║███╗██║ ██╔══██║ ██║   ██║██╔══╝  ██║╚██╗██║   ██║\n  ██║      ╚███╔███╔╝ ██║  ██║ ╚██████╔╝███████╗██║ ╚████║   ██║\n  ╚═╝       ╚══╝╚══╝  ╚═╝  ╚═╝  ╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝"
}
```

Partial overrides are fine — anything you omit falls through to the default. So to just change the prompt color you'd write:

```jsonc
{ "accentColor": "magenta" }
```

---

## Programmatic access

Anywhere in code (CLI commands, custom builders, downstream tools):

```ts
import { getBrand, getDefaultBrand, resetBrandCache } from "@bradygaster/squad-sdk";

const brand = getBrand();      // resolves once, caches for the process lifetime
console.log(`Hello from ${brand.nameUpper}`);

resetBrandCache();              // forces a re-resolve on the next getBrand() — useful in tests
const defaults = getDefaultBrand();  // unbranded base, ignores all overrides
```

---

## What's rendered with the brand today

| Component | Field used |
|---|---|
| Wide-tier banner ASCII | `bannerArt`, `accentColor` |
| Normal-tier banner header | `nameUpper`, `accentColor` |
| Narrow-tier banner header | `nameUpper`, `accentColor` |
| Border around banner (wide + normal) | `bannerBorderStyle`, `bannerBorderColor` (or `accentColor` if empty) |
| Banner tagline | `hintFull` |
| Experimental warning | `warnColor`, `issuesUrl` |
| Prompt label (`◆ squad>`) | `prompt`, `narrowPrompt`, `accentColor` |
| Coordinator manifest name | `coordinatorAgentName` |

Future surfaces (response prefixes, slash-command help, error messages) will pick up the brand as Squad evolves.

---

## Versioning + compatibility

- The branding module is part of `@bradygaster/squad-sdk` ≥ 0.10.0.
- Older Squad versions ignore the env vars / config files — there's no error if you set them and the consumer is too old.
- The `Brand` type is **append-only**: new fields land with sane defaults so existing brand files keep working.

---

## Example: pwagent's full brand

```jsonc
// squad.brand.json — committed at the root of the pwagent workspace
{
  "name": "pwagent",
  "nameUpper": "PWAGENT",
  "tagline": "Multi-agent Playwright testing — Squad design, GitHub Copilot SDK runtime",
  "prompt": "◆ pwagent> ",
  "narrowPrompt": "pw> ",
  "hintFull": "Type naturally · @Agent to direct · /help",
  "hintNarrow": "Tab completes · ↑↓ history",
  "accentColor": "magenta",
  "warnColor": "yellow",
  "bannerBorderStyle": "round",
  "bannerBorderColor": "magenta",
  "coordinatorAgentName": "pwagent",
  "issuesUrl": "github.com/microsoft/pwagent",
  "bannerArt": "  ██████╗  ██╗    ██╗  █████╗   ██████╗ ███████╗███╗   ██╗████████╗\n  ██╔══██╗ ██║    ██║ ██╔══██╗ ██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝\n  ██████╔╝ ██║ █╗ ██║ ███████║ ██║  ███╗█████╗  ██╔██╗ ██║   ██║\n  ██╔═══╝  ██║███╗██║ ██╔══██║ ██║   ██║██╔══╝  ██║╚██╗██║   ██║\n  ██║      ╚███╔███╔╝ ██║  ██║ ╚██████╔╝███████╗██║ ╚████║   ██║\n  ╚═╝       ╚══╝╚══╝  ╚═╝  ╚═╝  ╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝"
}
```
