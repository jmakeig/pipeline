<script>
	import { ago, coalesce } from '$lib/format';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<h1>Customer: {data.customer.name}</h1>

<div>
	Region: {data.customer.region}
</div>
<div>
	Segement: {data.customer.segment}
</div>

<h2>Workloads</h2>
<ul>
	<li>
		<a
			href="/customers/{data.customer.label}/workloads/new"
			title="/customers/{data.customer.label}/workloads/new">Add workload</a
		>
	</li>
</ul>
{#if data.customer.workloads}
	<table>
		<thead>
			<tr>
				<th>Name</th>
				<th>Stage</th>
				<th>Last Touched</th>
			</tr>
		</thead>
		<tbody>
			{#each data.customer.workloads as workload}
				<tr>
					<td><a href="/workloads/{workload.label}">{workload.name}</a></td>
					<td>
						{#if workload.stage}
							<span class="stage stage-{workload.stage.stage}">{workload.stage.stage}</span>
							{workload.stage.name}
						{:else}-
						{/if}
					</td>
					<td>{ago(workload.last_touched, '-')}</td>
				</tr>
			{/each}
		</tbody>
	</table>
{:else}
	<p>No workloads</p>
{/if}

<h2>Events</h2>
{#if data.customer.events}
	<table>
		<thead>
			<tr>
				<th>Workload</th>
				<th>Outcome</th>
				<th>Time</th>
			</tr>
		</thead>
		<tbody>
			{#each data.customer.events as event}
				<tr>
					<td>
						{coalesce(/** @type {import('$lib/types').Workload}*/ (event.workload)?.name, '-')}
					</td>
					<td>{event.outcome}</td>
					<td>{ago(event.happened_at, '-')}</td>
				</tr>
			{/each}
		</tbody>
	</table>
{:else}
	<p>No events</p>
{/if}

<details style="margin-top: 10em;">
	<summary><code>data.customer</code></summary>
	<pre>{JSON.stringify(data.customer, null, 2)}</pre>
</details>

<style>
	.stage {
		display: inline-block;
		width: 1em;
		padding: 0.25em 0.51em;
		border-radius: 1em;
		background-color: #ccc;
		text-align: center;
	}
	.stage.stage-1 {
		background-color: orangered;
	}
	.stage.stage-2 {
		background-color: rebeccapurple;
	}
	.stage.stage-3 {
		background-color: yellowgreen;
	}
	.stage.stage-4 {
		background-color: burlywood;
	}
	.stage.stage-5 {
		background-color: brown;
	}
</style>
