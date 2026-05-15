import { readFileSync, existsSync, watchFile, unwatchFile } from 'node:fs';
import type { SchedulerJob, ScheduleConfig } from './types.js';
import { configFilePath } from './paths.js';
import { validateCron } from './cron.js';

export function loadConfig(cwd = process.cwd()): SchedulerJob[] {
  const p = configFilePath(cwd);
  if (!existsSync(p)) return [];
  try {
    const raw = JSON.parse(readFileSync(p, 'utf8')) as ScheduleConfig;
    const jobs: SchedulerJob[] = [];
    for (const job of raw.jobs ?? []) {
      if (!job.id || !job.cron) {
        console.warn(`[scheduler] skipping job with missing id or cron:`, job);
        continue;
      }
      const cronErr = validateCron(job.cron);
      if (cronErr) {
        console.warn(`[scheduler] invalid cron "${job.cron}" for job "${job.id}": ${cronErr}`);
        continue;
      }
      if (!job.agent && !job.command) {
        console.warn(`[scheduler] job "${job.id}" has neither agent nor command — skipping`);
        continue;
      }
      jobs.push({ enabled: true, ...job });
    }
    return jobs;
  } catch (e) {
    console.warn(`[scheduler] failed to parse ${p}:`, e);
    return [];
  }
}

/** Watch the config file for changes. Returns a stop function. */
export function watchConfig(cwd: string, onChange: (jobs: SchedulerJob[]) => void): () => void {
  const p = configFilePath(cwd);
  let debounce: ReturnType<typeof setTimeout> | null = null;

  const handler = () => {
    if (debounce) clearTimeout(debounce);
    debounce = setTimeout(() => {
      debounce = null;
      onChange(loadConfig(cwd));
    }, 300);
  };

  watchFile(p, { interval: 2000 }, handler);
  return () => { unwatchFile(p, handler); };
}
