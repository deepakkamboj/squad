/**
 * Plugin marketplace commands — add/remove/list/browse
 * Port from beta index.js lines 716-833
 */
export interface Marketplace {
    name: string;
    source: string;
    added_at: string;
}
export interface MarketplacesRegistry {
    marketplaces: Marketplace[];
}
export declare function runPlugin(dest: string, args: string[]): Promise<void>;
//# sourceMappingURL=plugin.d.ts.map