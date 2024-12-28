<script>
	import { has } from '$lib/validation';
	import { tick } from 'svelte';

	let {
		name,
		value: _value,
		enabled: _enabled = false,
		id = name,
		type = 'text',
		placeholder = '',
		children = null // Defaults to input[type='text']
	} = $props();
	let enabled = $state(Boolean(_enabled));
	let value = $state(_value);

	/** @type {HTMLInputElement} */
	let enabler;

	//$inspect(_enabled).with(console.trace);

	/**
	 * @param {any} input
	 * @returns {value is {value: string}}
	 */
	function has_value(input) {
		return (
			input instanceof HTMLInputElement ||
			input instanceof HTMLSelectElement ||
			input instanceof HTMLTextAreaElement
		);
	}

	/**
	 *
	 * @param {Event} evt
	 * @returns {void}
	 */
	function handle_enable(evt) {
		if (evt.target instanceof HTMLInputElement) enabled = evt.target.checked;
		//if (enabled && input instanceof HTMLInputElement) tick().then(() => input.focus());

		// Don’t bubble to container handler
		evt.stopPropagation();
	}

	/**
	 *
	 * @param {Event} evt
	 * @returns {void}
	 */
	function handle_change(evt) {
		const input = evt.target;
		if (has_value(input)) {
			value = input.value;
		}
	}
</script>

<div onchange={handle_change}>
	{#if children}
		{@render children()}
	{:else}
		<input {id} {type} {value} disabled={!enabled} {placeholder} />
	{/if}
	<input
		type="checkbox"
		{name}
		checked={enabled}
		{value}
		onchange={handle_enable}
		bind:this={enabler}
	/>
	{value}
</div>

<style>
	div {
		display: flex;
		gap: 0.5em;
		align-items: baseline;
	}
</style>
