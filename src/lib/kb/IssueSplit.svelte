<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import { causeOf, uniqueById, type Cause, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  let {
    parserIssue,
    hintIssue,
  }: {
    parserIssue: string;
    hintIssue: string;
  } = $props();

  const ticketRows = (reports as Report[]).filter((report) => report.mergedInto === 4471);
  const ticketReports = uniqueById(ticketRows);
  const duplicateRows = ticketRows.length - ticketReports.length;
  const count = (cause: Cause) =>
    ticketReports.filter((report) => causeOf(report, tenantOf(report)) === cause).length;
  const parser = count('parser');
  const hint = count('hint');
</script>

<p>
  The export has <strong>{ticketRows.length}</strong> rows merged into #4471. Deduplicating by report ID leaves
  <strong>{ticketReports.length}</strong> reports; {duplicateRows} repeated rows do not add coverage.
</p>

<table>
  <thead>
    <tr><th>separate problem</th><th>reports</th><th>ticket</th></tr>
  </thead>
  <tbody>
    <tr>
      <td>The shared parser reads every date month first, even for day-first tenant locales.</td>
      <td>{parser}</td>
      <td><a href={parserIssue}>parser issue</a></td>
    </tr>
    <tr>
      <td>booking-v3 shows a month-first hint but reads the date in a day-first tenant locale.</td>
      <td>{hint}</td>
      <td><a href={hintIssue}>date-hint issue</a></td>
    </tr>
  </tbody>
</table>

<p>
  The two counts add up to <strong>{parser + hint}</strong>, the complete deduplicated set merged into #4471.
</p>
