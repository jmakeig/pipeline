<script>
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<h1>Customers</h1>
<table>
	<thead>
		<tr>
			<th>Customer</th>
			<th>Workloads</th>
			<th>Events</th>
		</tr>
	</thead>
	<tbody>
		{#each data.customers as customer}
			<tr>
				<td><a href="/customers/{customer.label}">{customer.name}</a></td>
				<td><a href="/workloads/{customer.label}">Workloads</a></td>
				<td><a href="/events/{customer.label}">Events</a></td>
			</tr>
		{/each}
	</tbody>
</table>
<pre>{JSON.stringify(data.customers, null, 2)}</pre>
