/**
 * Public types for @bradygaster/squad-scheduler.
 *
 * Config file: `squad.schedule.json` in the project root (or wherever
 * SQUAD_SCHEDULE_FILE env var points). Drop the file, run `squad-scheduler
 * start`, and your jobs run on their cron schedule.
 *
 * Two dispatch surfaces:
 *   agent   — runs a Squad agent:   squad @triage --ado-pipeline 23878
 *   command — runs any shell cmd:   node scripts/report.mjs
 */

/** A single scheduled job as declared in squad.schedule.json. */
export interface SchedulerJob {
  /** Unique kebab-case identifier used for state, locks, and logs. */
  id: string;
  /** Human-readable label shown in `list` output and log headers. */
  name: string;
  /** Standard 5-field cron expression: minute hour dom month dow
   *  Examples:
   *    "0 9 * * 1-5"   - 9 AM on weekdays
   *    "* /30 * * * *" - every 30 minutes (remove the space before /30)
   *    "0 0 * * 0"     - midnight Sundays
   */
  cron: string;
  /**
   * Squad agent to invoke (mutually exclusive with `command`).
   * Runs: squad @<agent> <args>
   * Example: agent="triage", args="--ado-pipeline 23878"
   */
  agent?: string;
  /** Extra arguments appended after the agent name. */
  args?: string;
  /**
   * Shell command to run (mutually exclusive with `agent`).
   * Runs via the platform shell (pwsh on Windows, sh elsewhere).
   * Example: "node scripts/report.mjs --env prod"
   */
  command?: string;
  /** Whether the job is active. Default: true. */
  enabled?: boolean;
  /** Human-readable description shown in `list` output. */
  description?: string;
  /** Max seconds before the process is killed. Default: 600. */
  maxRunSeconds?: number;
  /** Retry on non-zero exit. Default: false. */
  retryOnFailure?: boolean;
  /** Max retry attempts (only when retryOnFailure=true). Default: 2. */
  maxRetries?: number;
  /** Seconds to wait between retries. Default: 30. */
  retryBackoffSeconds?: number;
  /** Auto-disable after this many consecutive failures. Default: 5. */
  disableAfterFailures?: number;
  /** Fire once immediately at scheduler startup. Default: false. */
  runOnStartup?: boolean;
}

/** Top-level shape of squad.schedule.json. */
export interface ScheduleConfig {
  jobs: SchedulerJob[];
}

/** Runtime state persisted across restarts. */
export interface JobState {
  lastRunAt?: string;
  nextDueAt?: string;
  lastExitCode?: number;
  consecutiveFailures: number;
  autoDisabled?: boolean;
  autoDisabledAt?: string;
}

export interface SchedulerState {
  jobs: Record<string, JobState>;
  updatedAt: string;
}

/** Lifecycle event written to <id>.jsonl. */
export type EventKind =
  | 'job_start'
  | 'job_end'
  | 'job_error'
  | 'job_timeout'
  | 'job_retry'
  | 'job_auto_disabled'
  | 'scheduler_start'
  | 'scheduler_stop';

export interface SchedulerEvent {
  ts: string;
  kind: EventKind;
  jobId?: string;
  runId?: string;
  exitCode?: number;
  durationMs?: number;
  attempt?: number;
  message?: string;
}

export interface DispatchResult {
  exitCode: number;
  durationMs: number;
  timedOut: boolean;
}
