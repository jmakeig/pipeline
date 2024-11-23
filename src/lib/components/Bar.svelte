<script>
	import { exists } from '$lib/util';

	/** @type {{children: any, value?: number?, max?:number?}} */
	let { children, value, max = value } = $props();
</script>

<!-- Dumb -->
<!-- {#if undefined !== value && undefined !== max && null !== value && null !== max} -->
{#if exists(value) && exists(max)}
	<div class="wrapper">
		<span class="bar" style="width: {Math.min(value / max, 1) * 100}%"></span>
		<span class="value">{@render children?.()}</span>
	</div>
{/if}

<style>
	.wrapper {
		position: relative;
		height: 1.5em;
		overflow: clip;
	}
	.bar,
	.value {
		position: absolute;
		right: 0;
		top: 0;
		height: 100%;
	}
	.bar {
		background: #eee;
	}
	.value {
		top: 0.25em;
		right: 0.25em;
		text-align: right;
		vertical-align: baseline;
	}
</style>
