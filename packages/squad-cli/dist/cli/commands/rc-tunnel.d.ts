/**
 * Squad Remote Control — Devtunnel lifecycle management
 *
 * Creates, hosts, and cleans up devtunnels with squad labels
 * for discovery from the PWA dashboard.
 */
export interface TunnelInfo {
    tunnelId: string;
    url: string;
    port: number;
}
export interface TunnelLabels {
    repo: string;
    branch: string;
    machine: string;
}
/** Check if devtunnel CLI is available */
export declare function isDevtunnelAvailable(): boolean;
/** Create a devtunnel with squad labels and host it */
export declare function createTunnel(port: number, labels: TunnelLabels): Promise<TunnelInfo>;
/** Clean up the tunnel */
export declare function destroyTunnel(): void;
/** Get machine hostname for labels */
export declare function getMachineId(): string;
/** Get repo name and branch from git */
export declare function getGitInfo(cwd: string): {
    repo: string;
    branch: string;
};
//# sourceMappingURL=rc-tunnel.d.ts.map