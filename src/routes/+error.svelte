<script>
	import { page } from '$app/stores';
</script>

<svelte:head>
	<style>
		body {
			color: var(--color-error);
			background-color: var(--color-error-secondary);
		}
	</style>
</svelte:head>
<h1>{$page.status} Error</h1>
<p>{$page.error?.message}</p>
