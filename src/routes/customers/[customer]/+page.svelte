<script>
	import { ago } from '$lib/format';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<h1>Customer: {data.customer.name}</h1>
<ul>
	<li><a href="/customers/{data.customer.label}/workloads/new" title="/customers/{data.customer.label}/workloads/new">Add workload</a></li>
</ul>
<div>
	Region: {data.customer.region}
</div>
<div>
	Segement: {data.customer.segment}
</div>

<h2>Workloads</h2>
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
				<td>{workload.name}</td>
				<td>{workload.stage?.stage}</td>
				<td>{ago(workload.last_touched)}</td>
			</tr>
		{/each}
	</tbody>
</table>

<h2>Events</h2>
<table>
	<tbody>
		{#each data.customer.events as event}
			<tr>
				<td>{event.outcome}</td>
				<td>{ago(event.happened_at)}</td>
			</tr>
		{/each}
	</tbody>
</table>

<details style="margin-top: 10em;">
	<summary><code>data.customer</code></summary>
	<pre>{JSON.stringify(data.customer, null, 2)}</pre>
</details>
