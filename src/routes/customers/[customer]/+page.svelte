<script>
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<h1>Customer: {data.customer.name}</h1>
<ul>
	<li><a href="/customers/{data.customer.label}/workloads/new">Add workload</a></li>
</ul>
