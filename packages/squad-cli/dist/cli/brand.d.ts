/**
 * Brand resolution for squad-cli.
 *
 * Vendored from @bradygaster/squad-sdk/branding so squad-cli can be installed
 * as a standalone GitHub path dependency without requiring the fork's squad-sdk.
 *
 * Resolution order (later wins): default → ~/.squad/brand.json →
 * <cwd>/squad.brand.json → <cwd>/.<name>/brand.json → <cwd>/.squad/brand.json → env vars.
 */
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
export declare function getBrand(cwd?: string): Brand;
export declare function resetBrandCache(): void;
export declare function getDefaultBrand(): Brand;
//# sourceMappingURL=brand.d.ts.map