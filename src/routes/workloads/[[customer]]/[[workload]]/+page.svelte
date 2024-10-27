<script>
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
			<th>Events</th>
		</tr>
	</thead>
	<tbody>
		{#each data.workloads as workload}
			<tr>
				<td><a href="/customers/{workload.customer_label}">{workload.customer_name}</a></td>
				<td><a href="/workloads/{workload.customer_label}/{workload.label}">{workload.name}</a></td>
				<td><a href="/events/{workload.customer_label}/{workload.label}">Events</a></td>
			</tr>
		{/each}
	</tbody>
</table>
