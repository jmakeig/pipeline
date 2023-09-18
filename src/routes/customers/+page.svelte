<script>
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<h1>Customers</h1>
<table>
	<tbody>
		{#each data.customers as customer (customer.customer_id)}
			<tr id={`customer_` + customer.customer_id}>
				<td>{customer.label}</td>
			</tr>
		{:else}
			Nope
		{/each}
	</tbody>
</table>
