// The problems a merged ticket really holds. causes.ts says which cause a report's tenant and
// channel point to; a report the desk read as a one-day move (desk-notes.json) is a different
// problem whatever its tenant: the date shifted by a day, it was not swapped.
import { causeOf, uniqueById, type Cause, type Report, type Tenant } from '#lib/kb/causes';

export type Problem = Cause | 'day-shift' | 'unplaced';

export function problemOf(r: Report, t: Tenant | undefined, oneDayMove: readonly string[]): Problem {
  if (oneDayMove.includes(r.id)) return 'day-shift';
  return causeOf(r, t) ?? 'unplaced';
}

export type ProblemCount = { problem: Problem; reports: number; tenants: number; firstSeen: string; lastSeen: string };

export function countProblems(
  rows: Report[],
  ticket: number,
  tenantOf: (r: Report) => Tenant | undefined,
  oneDayMove: readonly string[],
): { rows: number; reports: number; problems: ProblemCount[] } {
  const merged = rows.filter((r) => r.mergedInto === ticket);
  const reports = uniqueById(merged);
  const by = new Map<Problem, Report[]>();
  for (const r of reports) {
    const p = problemOf(r, tenantOf(r), oneDayMove);
    by.set(p, [...(by.get(p) ?? []), r]);
  }
  const problems = [...by.entries()]
    .map(([problem, rs]) => {
      const days = rs.map((r) => r.receivedAt.slice(0, 10)).sort();
      return { problem, reports: rs.length, tenants: new Set(rs.map((r) => r.tenant)).size, firstSeen: days[0], lastSeen: days[days.length - 1] };
    })
    .sort((a, b) => b.reports - a.reports);
  return { rows: merged.length, reports: reports.length, problems };
}
