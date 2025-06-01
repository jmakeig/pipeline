<script>
	/** @type {{ data: import('./$types').PageData}} */
	let { data } = $props();

</script>

<h1>Customers</h1>
<p><a href="/customers/new">New…</a></p>
<table>
	<thead>
		<tr>
			<th>Customer</th>
			<th>Region</th>
			<th>Segment</th>
		</tr>
	</thead>
	<tbody>
		{#each data.customers as customer}
			<tr>
				<td><a href="/customers/{customer.label}">{customer.name}</a></td>
				<td>{customer.region}</td>
				<td>{customer.segment}</td>
			</tr>
		{/each}
	</tbody>
</table>

