<script>
	import { format_date, format_number, pluralize } from '$lib/format';

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
			<th>Last</th>
			<th>Events</th>
		</tr>
	</thead>
	<tbody>
		{#each data.workloads as workload}
			<tr>
				<td><a href="/customers/{workload.customer_label}">{workload.customer_name}</a></td>
				<td><a href="/workloads/{workload.customer_label}/{workload.label}">{workload.name}</a></td>
				<td>{format_date(workload.last_happened_at)}</td>
				<td
					><a href="/events/{workload.customer_label}/{workload.label}">
						{pluralize(workload.events_count || 0, 'event', 'events')}</a
					></td
				>
			</tr>
		{/each}
	</tbody>
</table>
