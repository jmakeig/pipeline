<script>
	import { ago, currency, date, num } from '$lib/format';
	import Bar from '$lib/components/Bar.svelte';

	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();
</script>

<h1>Pipeline</h1>
<h2>$12,345,678</h2>
<ol>
	{#each data.stages as stage}
		<li>
			<span class="stage stage-{stage.stage}">{stage.stage} - {stage.name}</span>
			{currency(stage.workloads.size, { round: 0 })} ({num(stage.workloads.count)})
		</li>
	{/each}
</ol>

<table>
	<thead>
		<tr>
			<th class="sortable">Customer</th>
			<th class="sortable">Workload</th>
			<th class="sortable">Stage</th>
			<th class="sortable" title="Annualized Recurring Revenue">ARR</th>
			<th>Age</th>
			<th class="sortable">Urgency</th>
			<th class="sortable">Lead</th>
		</tr>
	</thead>
	<tbody>
		{#each data.follow_ups as follow_up}
			<tr>
				<td><a href="/customers/{follow_up.workload.customer.label}">{follow_up.workload.customer.name}</a></td>
				<td><a href="/workloads/{follow_up.workload.label}">{follow_up.workload.name}</a></td>
				<td>{follow_up.workload.stage?.stage} - {follow_up.workload.stage?.name}</td>
				<td style="text-align: right;" title={currency(follow_up.workload.size, { round: 0 })}>
					<Bar
						value={follow_up.workload.size}
						max={data.follow_ups.reduce(
							/** @type {(max:number, w:{workload:import('$lib/types').Workload}) => number} */ (
								max,
								w
							) => Math.max(max, w.workload.size || -Infinity),
							0
						)}
						>{currency(follow_up.workload.size, { round: 0, notation: 'compact', min: 1000 })}</Bar
					>
				</td>
				<!-- <td class="numeric">{currency(follow_up.workload.size, { round: 0 })}</td> -->
				<td class="numeric">{ago(new Date(follow_up.workload.last_touched))}</td>
				<td>{follow_up.urgency}</td>
				<td>{follow_up.workload.lead}</td>
			</tr>
		{/each}
	</tbody>
</table>

<details>
	<summary><code>data</code></summary>
	<pre>{JSON.stringify(data.follow_ups, null, 2)}</pre>
	<pre>{JSON.stringify(data.stages, null, 2)}</pre>
</details>
