/**
 * @bradygaster/squad-scheduler
 *
 * Cron-based job scheduler for Squad agent projects.
 *
 * Config: drop a `squad.schedule.json` in your project root:
 *
 *   {
 *     "jobs": [
 *       {
 *         "id": "daily-triage",
 *         "name": "Daily Triage",
 *         "cron": "0 9 * * 1-5",
 *         "agent": "triage",
 *         "args": "--ado-pipeline 23878"
 *       },
 *       {
 *         "id": "hourly-monitor",
 *         "name": "Hourly Monitor",
 *         "cron": "0 * * * *",
 *         "command": "node scripts/monitor.mjs"
 *       }
 *     ]
 *   }
 *
 * Then start: `squad-scheduler start`  (or call startScheduler() programmatically)
 *
 * Environment overrides:
 *   SQUAD_SCHEDULER_HOME   — override the ~/.{brand}/scheduler/ base path
 *   SQUAD_SCHEDULE_FILE    — override the squad.schedule.json location
 */
export { startScheduler } from './loop.js';
export { loadConfig, watchConfig } from './loader.js';
export { parseCron, nextDue, describeCron, validateCron } from './cron.js';
export { loadState, saveState } from './state.js';
export { emitEvent, emitGlobal } from './events.js';
export { schedulerHome, configFilePath, pidPath, eventsPath, logPath } from './paths.js';
//# sourceMappingURL=index.js.map