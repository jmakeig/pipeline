<script>
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<h1>Customers</h1>
{#await data.customers then customers}
	<ol>
		{#each customers as customer, index}
			<li>{customer.name}</li>
		{/each}
	</ol>
{/await}
