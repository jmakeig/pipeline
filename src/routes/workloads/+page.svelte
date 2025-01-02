<script>
	import { ago, pluralize } from '$lib/format';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<h1>Workloads</h1>
<p>All the workloads</p>
<!-- <pre>{JSON.stringify(data.workloads)}</pre> -->
<table>
	<thead>
		<tr>
			<th>Customer</th>
			<th>Workload</th>
			<th>Last Touched</th>
			<th>Events</th>
		</tr>
	</thead>
	<tbody>
		{#each data.workloads as workload}
			<tr>
				<td><a href="/customers/{workload.customer.label}">{workload.customer.name}</a></td>
				<td><a href="/workloads/{workload.customer.label}/{workload.label}">{workload.name}</a></td>
				<td>{ago(workload.last_touched, '-')}</td>
				<td
					><a href="/events/{workload.customer.label}/{workload.label}">
						{pluralize(workload.events.length || 0, 'event', 'events')}</a
					></td
				>
			</tr>
		{/each}
	</tbody>
</table>
