/**
 * Aspire command — Launch .NET Aspire dashboard for Squad observability
 * (Issue #265)
 *
 * Starts the Aspire dashboard and configures OTLP export so Squad
 * traces and metrics flow into the dashboard automatically.
 */
export interface AspireOptions {
    /** Use Docker even if dotnet is available */
    docker?: boolean;
    /** Custom OTLP endpoint port */
    port?: number;
}
/**
 * Run the `squad aspire` command.
 * Launches the Aspire dashboard and configures OTLP export.
 */
export declare function runAspire(options?: AspireOptions): Promise<void>;
//# sourceMappingURL=aspire.d.ts.map