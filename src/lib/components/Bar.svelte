<script>
	/** @type {{children: any, value: number, max:number}} */
	let { children, value, max = value } = $props();
</script>

<span style="width: calc({Math.min(value / max, 1) * 100}% - 1.5em)">{@render children?.()}</span>

<style>
	span {
		display: inline-block;
		margin: 0 0.5em;
		padding: 0.25em;
		background: #eee;
		text-align: right;
		overflow: clip;
		/* outline: solid 0.5px red; */
	}
</style>
