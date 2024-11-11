<script>
	/** @type {{children: any, value?: number, max?:number}} */
	let { children, value, max = value } = $props();
</script>

{#if undefined === value || undefined === max}
	Nope
{:else}
	<span style="width: calc({Math.min(value / max, 1) * 100}% - 0.5em)">{@render children?.()}</span>
{/if}

<style>
	span {
		display: inline-block;
		margin: 0;
		padding: 0.25em 0.25em;
		background: #eee;
		text-align: right;
		overflow: visibe;
		white-space: nowrap;
	}
</style>
