<script>
	import { currency, num } from '$lib/format';

	const stages = [
		{ stage: 0, name: 'Qualify', arr: 987000, count: 9 },
		{ stage: 1, name: 'Refine', arr: 44321, count: 3 },
		{ stage: 2, name: 'Tech Eval/Solution Dev', arr: 155000, count: 3 },
		{ stage: 3, name: 'Proposal Negotiation', arr: 0, count: 3 },
		{ stage: 4, name: 'Migration/Implementation', arr: 2009500, count: 3 }
	];
</script>

<h1>Pipeline</h1>
<h2>$12,345,678</h2>
<ol>
	{#each stages as stage}
		<li>
			<span class="stage stage-{stage.stage}">{stage.stage}</span>
			{currency(stage.arr, { round: 0 })} ({num(stage.count)})
		</li>
	{/each}
</ol>
<table>
	<thead>
		<tr>
			<th class="sortable">Customer</th>
			<th class="sortable">Workload</th>
			<th class="sortable">Stage</th>
			<th class="sortable"><span title="Annualized Recurring Revenue">ARR</span></th>
			<th class="sortable">Urgency</th>
			<th class="sortable">Lead</th>
		</tr>
	</thead>
	<tbody></tbody>
</table>
