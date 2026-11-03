<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { countProblems, type Problem } from '#lib/kb/problems';
  import { tenantOf } from '#lib/kb/locales';
  import type { Report } from '#lib/kb/causes';

  // Words and links for each problem come from the page; counts come from the data.
  type About = { what: string; issue: number; status: string };
  let { ticket, repo, rows: about }: { ticket: number; repo: string; rows: Partial<Record<Problem, About>> } = $props();

  const split = $derived(countProblems(reports as Report[], ticket, tenantOf, notes.oneDayMove));
  const total = $derived(split.problems.reduce((n, p) => n + p.reports, 0));
</script>

<p class="sum">
  <strong>{split.rows}</strong> exported rows merged into #{ticket} · <strong>{split.reports}</strong> reports once
  duplicates are dropped · <strong>{split.problems.length}</strong> problems
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>tenants</th><th>seen</th><th>status</th><th>ticket</th></tr>
  </thead>
  <tbody>
    {#each split.problems as p (p.problem)}
      <tr>
        <td><code>{p.problem}</code><br />{about[p.problem]?.what ?? ''}</td>
        <td>{p.reports}</td>
        <td>{p.tenants}</td>
        <td>{p.firstSeen} → {p.lastSeen}</td>
        <td>{about[p.problem]?.status ?? 'no ticket'}</td>
        <td>{#if about[p.problem]}<a href="https://github.com/{repo}/issues/{about[p.problem]?.issue}">#{about[p.problem]?.issue}</a>{:else}—{/if}</td>
      </tr>
    {/each}
  </tbody>
  <tfoot>
    <tr><td>total</td><td>{total}</td><td colspan="4"></td></tr>
  </tfoot>
</table>

<style>
  .sum { font-size: 1.1rem; }
  tfoot td { font-weight: 600; }
</style>
