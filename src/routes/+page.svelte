<script>
	import { ago, currency, date, num } from '$lib/format';
	import Bar from '$lib/components/Bar.svelte';
	import Stage from '$lib/components/Stage.svelte';

	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();
</script>

<header>
	<div class="uno">
		<h1>Pipeline</h1>
		<ol class="stages">
			{#each data.stages as stage}
				<li>
					<Stage {stage}>
						<strong>{stage.name}</strong>
						{#if stage.workloads.count > 0}
							{' - '}
							<small
								>{currency(stage.workloads.size, { style: 'thousands' })} ({num(
									stage.workloads.count
								)})</small
							>
						{/if}
					</Stage>
				</li>
			{/each}
		</ol>
	</div>
	<div class="pipeline_size">
		<div>{currency(data.size, { round: 0 })}</div>
		<p>Estmated ARR for 2025</p>
	</div>
</header>
<section class="workloads">
	<table>
		<thead>
			<tr>
				<th class="sortable" role="columnheader">Customer</th>
				<th class="sortable" role="columnheader">Workload</th>
				<th class="sortable" role="columnheader">Stage</th>
				<th class="sortable" title="Annualized Recurring Revenue" role="columnheader">ARR</th>
				<th role="columnheader">Age</th>
				<th class="sortable" role="columnheader">Urgency</th>
				<th class="sortable" role="columnheader">Lead</th>
			</tr>
		</thead>
		<tbody>
			{#each data.follow_ups as follow_up}
				<tr>
					<td role="cell">
						<a href="/customers/{follow_up.workload.customer.label}">
							{follow_up.workload.customer.name}
						</a>
					</td>
					<td role="cell"
						><a href="/workloads/{follow_up.workload.label}">{follow_up.workload.name}</a></td
					>
					<td role="cell">
						{#if follow_up.workload.stage}
							<Stage stage={follow_up.workload.stage}>
								{follow_up.workload.stage?.name}
							</Stage>
						{/if}
					</td>
					<td
						role="cell"
						style="text-align: right;"
						title={currency(follow_up.workload.size, { round: 0 })}
					>
						<Bar
							value={follow_up.workload.size}
							max={data.follow_ups.reduce(
								/** @type {(max:number, w:{workload:import('$lib/types').Workload}) => number} */ (
									max,
									w
								) => Math.max(max, w.workload.size || -Infinity),
								0
							)}
						>
							{currency(follow_up.workload.size, {
								style: 'thousands',
								minimumFractionDigits: 0,
								maximumFractionDigits: 2
							})}
						</Bar>
						<!--{currency(follow_up.workload.size, { round: 0, notation: 'compact', min: 1000 })}-->
					</td>
					<!-- <td class="numeric">{currency(follow_up.workload.size, { round: 0 })}</td> -->
					<td role="cell" class="numeric">{ago(new Date(follow_up.workload.last_touched))}</td>
					<td role="cell">{follow_up.urgency}</td>
					<td role="cell">{follow_up.workload.lead}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</section>

<details>
	<summary><code>data</code></summary>
	<pre>{JSON.stringify(data.follow_ups, null, 2)}</pre>
	<pre>{JSON.stringify(data.stages, null, 2)}</pre>
</details>

<style>
	header {
		display: flex;
		align-items: baseline;
		gap: 2em;
	}
	header .uno {
		flex-grow: 1;
	}
	.pipeline_size {
		background-color: #f6f6f6;
		padding: 1em;
		border-radius: 1em;
	}
	.pipeline_size > div {
		font-size: 1.5em;
		font-weight: bold;
	}
	.pipeline_size > p {
		margin: 0.25em 0;
		font-size: 0.75em;
		text-wrap: nowrap;
	}

	ol.stages {
		list-style: none;
		padding: 0;

		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: flex-start;
		gap: 1em 2em;
	}
	/* ol.stages > li {} */
	section {
		margin: 0.5em 0;
	}
</style>
