<script>
	import { page } from '$app/stores';
</script>

<svelte:head>
	<style>
		body {
			background-color: red;
		}
	</style>
</svelte:head>
<h1>Error</h1>
<p>{$page.error?.message}</p>
<p>{$page.error?.code}</p>
