<script>
	import { page } from '$app/state';
	import { dev } from '$app/environment';
</script>

<svelte:head>
	<style>
		body {
			color: var(--color-error);
		}
	</style>
</svelte:head>
<h1>{page.status} {page.error?.message}</h1>
{#if dev && page.error}
	<h2>Stack</h2>
	<ol class="stack">
		{#each page.error.stack || [] as stack}
			<li>
				{#if stack.match(/\/workspaces\/pipeline\/src\//)}
					<em>{stack}</em>
				{:else}{stack}{/if}
			</li>
		{/each}
	</ol>
{/if}

<style>
	ol.stack {
		list-style: none;
		padding: 0;
		font-family: monospace;
	}
	ol.stack > li {
		margin-left: 1.5em;
	}
	ol.stack > li:first-child {
		margin-left: 0;
		color: var(--color-error);
		font-size: 1.25em;
	}
	ol.stack > li {
		color: var(--color-error-secondary);
	}
	ol.stack > li em {
		font-style: normal;
		color: var(--color-error);
	}
</style>
