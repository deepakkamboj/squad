/**
 * Minimal 5-field cron parser and next-due calculator.
 * Format: minute hour day-of-month month day-of-week
 *
 * Supported syntax per field:
 *   *         any value
 *   n         exact value
 *   n-m       inclusive range
 *   n,m,o     comma list (values, ranges, or steps may be mixed)
 *   *\/n      step from 0 (or from range start)
 *   n-m\/n    step within range
 *
 * Day-of-week: 0 = Sunday … 6 = Saturday. Names: SUN MON TUE WED THU FRI SAT.
 * Month names: JAN FEB MAR APR MAY JUN JUL AUG SEP OCT NOV DEC.
 */
const DOW_NAMES = {
    SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6,
};
const MON_NAMES = {
    JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6,
    JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12,
};
function parseName(s, map) {
    const v = map[s.toUpperCase()];
    if (v !== undefined)
        return v;
    const n = parseInt(s, 10);
    if (isNaN(n))
        throw new Error(`Invalid cron token: ${s}`);
    return n;
}
function expandField(field, min, max, nameMap) {
    const result = new Set();
    const parse = (s) => nameMap ? parseName(s, nameMap) : parseInt(s, 10);
    for (const part of field.split(',')) {
        if (part === '*') {
            for (let i = min; i <= max; i++)
                result.add(i);
            continue;
        }
        const stepMatch = part.match(/^(.+)\/(\d+)$/);
        if (stepMatch) {
            const [, range, stepStr] = stepMatch;
            const step = parseInt(stepStr, 10);
            let lo = min, hi = max;
            if (range !== '*') {
                const dash = range.indexOf('-');
                if (dash >= 0) {
                    lo = parse(range.slice(0, dash));
                    hi = parse(range.slice(dash + 1));
                }
                else {
                    lo = parse(range);
                }
            }
            for (let i = lo; i <= hi; i += step)
                result.add(i);
            continue;
        }
        const dashIdx = part.indexOf('-');
        if (dashIdx >= 0) {
            const lo = parse(part.slice(0, dashIdx));
            const hi = parse(part.slice(dashIdx + 1));
            for (let i = lo; i <= hi; i++)
                result.add(i);
            continue;
        }
        result.add(parse(part));
    }
    return result;
}
export function parseCron(expr) {
    const parts = expr.trim().split(/\s+/);
    if (parts.length !== 5)
        throw new Error(`Cron must have 5 fields, got: "${expr}"`);
    const [min, hour, dom, month, dow] = parts;
    return {
        minutes: expandField(min, 0, 59),
        hours: expandField(hour, 0, 23),
        doms: expandField(dom, 1, 31),
        months: expandField(month, 1, 12, MON_NAMES),
        dows: expandField(dow, 0, 6, DOW_NAMES),
        raw: expr,
    };
}
/** Compute the next Date >= `after` that matches the cron expression. */
export function nextDue(cron, after = new Date()) {
    // Start from the next whole minute after `after`
    const start = new Date(after);
    start.setSeconds(0, 0);
    start.setMinutes(start.getMinutes() + 1);
    const d = new Date(start);
    const limit = new Date(d);
    limit.setFullYear(limit.getFullYear() + 4); // safety: give up after 4 years
    while (d < limit) {
        if (!cron.months.has(d.getMonth() + 1)) {
            d.setMonth(d.getMonth() + 1, 1);
            d.setHours(0, 0, 0, 0);
            continue;
        }
        if (!cron.doms.has(d.getDate()) || !cron.dows.has(d.getDay())) {
            d.setDate(d.getDate() + 1);
            d.setHours(0, 0, 0, 0);
            continue;
        }
        if (!cron.hours.has(d.getHours())) {
            d.setHours(d.getHours() + 1, 0, 0, 0);
            continue;
        }
        if (!cron.minutes.has(d.getMinutes())) {
            d.setMinutes(d.getMinutes() + 1, 0, 0);
            continue;
        }
        return d;
    }
    throw new Error(`No matching time found for cron: ${cron.raw}`);
}
/** Human-readable summary of a cron expression. */
export function describeCron(expr) {
    try {
        const c = parseCron(expr);
        if (expr === '* * * * *')
            return 'every minute';
        const minArr = [...c.minutes].sort((a, b) => a - b);
        const hrArr = [...c.hours].sort((a, b) => a - b);
        const domArr = [...c.doms].sort((a, b) => a - b);
        const dowArr = [...c.dows].sort((a, b) => a - b);
        if (c.minutes.size === 60)
            return hrArr.length === 24 ? 'every minute' : `every hour`;
        if (c.minutes.size === 1 && c.hours.size === 24)
            return `every hour at :${String(minArr[0]).padStart(2, '0')}`;
        if (c.dows.size === 5 && !c.dows.has(0) && !c.dows.has(6)) {
            if (c.minutes.size === 1 && c.hours.size === 1)
                return `weekdays at ${String(hrArr[0]).padStart(2, '0')}:${String(minArr[0]).padStart(2, '0')}`;
        }
        if (c.dows.size === 7 && c.doms.size === 31 && c.months.size === 12) {
            if (c.minutes.size === 1 && c.hours.size === 1)
                return `daily at ${String(hrArr[0]).padStart(2, '0')}:${String(minArr[0]).padStart(2, '0')}`;
        }
        const dowNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        if (c.dows.size === 1 && c.minutes.size === 1 && c.hours.size === 1)
            return `${dowNames[dowArr[0]]} at ${String(hrArr[0]).padStart(2, '0')}:${String(minArr[0]).padStart(2, '0')}`;
        return expr;
    }
    catch {
        return expr;
    }
}
/** Validate a cron string, returning an error message or null if valid. */
export function validateCron(expr) {
    try {
        parseCron(expr);
        return null;
    }
    catch (e) {
        return e instanceof Error ? e.message : String(e);
    }
}
//# sourceMappingURL=cron.js.map