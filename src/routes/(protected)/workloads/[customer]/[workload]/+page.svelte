<script>
	/** @type {import('./$types').PageProps} */
	let { data } = $props();
	const workload = data.workload;
</script>

<h1>{workload.name}</h1>
