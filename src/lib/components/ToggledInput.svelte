<script>
	import { tick } from 'svelte';

	let {
		name,
		value: _value,
		enabled: _enabled = false,
		id = name,
		type = 'text',
		placeholder = ''
	} = $props();
	let enabled = $state(Boolean(_enabled));
	let value = $state(_value);

	/** @type {HTMLInputElement} */
	let input;

	//$inspect(_enabled).with(console.trace);

	/**
	 *
	 * @param {Event} evt
	 */
	function handle_enable(evt) {
		if (evt.target instanceof HTMLInputElement) enabled = evt.target.checked;
		if (enabled && input instanceof HTMLInputElement) tick().then(() => input.focus());
	}
</script>

<div>
	<input
		{id}
		{type}
		{value}
		disabled={!enabled}
		onchange={(evt) => (value = evt.currentTarget?.value)}
		{placeholder}
		bind:this={input}
	/>
	<input type="checkbox" {name} checked={enabled} {value} onchange={handle_enable} />
</div>

<style>
	div {
		display: flex;
		gap: 0.5em;
		align-items: baseline;
	}
</style>
