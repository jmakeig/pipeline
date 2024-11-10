<script>
	/** @type {{children: any, value: number, max:number}} */
	let { children, value, max = value } = $props();
</script>

<span style="width: calc({Math.min(value / max, 1) * 100}% - 0.5em)">{@render children?.()}</span>

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
