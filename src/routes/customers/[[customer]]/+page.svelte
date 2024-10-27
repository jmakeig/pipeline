<script>
    /** @type {import('./$types').PageData} */
    export let data;
</script>

<h1>Customers</h1>
<table>
	<thead>
		<tr>
			<th>Customer</th>
		</tr>
	</thead>
	<tbody>
		{#each data.customers as customer}
			<tr>
				<td><a href="/customers/{customer.label}">{customer.name}</a></td>
			</tr>
		{/each}
	</tbody>
</table>
<pre>{JSON.stringify(data.customers, null, 2)}</pre>