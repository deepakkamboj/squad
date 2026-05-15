/**
 * Squad Remote Control — CLI Command
 *
 * `squad rc` or `squad remote-control`
 * Starts the RemoteBridge, creates a devtunnel, shows QR code.
 */
export interface RCOptions {
    tunnel: boolean;
    port: number;
    path?: string;
}
export declare function runRC(cwd: string, options: RCOptions): Promise<void>;
//# sourceMappingURL=rc.d.ts.map