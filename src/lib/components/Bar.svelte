<script>
	/** @type {{children: any, value?: number?, max?:number?}} */
	let { children, value, max = value } = $props();

	/**
	 * @param {...any} values
	 * @returns {boolean}
	 */
	function exists(...values) {
		for (const value of values) {
			if (value === null || value === undefined) return false;
		}
		return true;
	}
</script>

<!-- Dumb -->
<!-- {#if undefined !== value && undefined !== max && null !== value && null !== max} -->
{#if exists(value, max)}
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
