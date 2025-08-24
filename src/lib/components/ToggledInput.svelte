<script>
	import { tick } from 'svelte';
	let {
		name, // Name under which to sumbit the value in the form
		id = undefined, // Optional id, for example, for use with `label[for]`
		value: _value, // The default value
		disabled: _disabled = false, // Whether the input will be submitted
		input = null, // Optional custom input. Must _not_ have a `name` attribute.
		placeholder
	} = $props();
	let value = $state(_value);
	let disabled = $state(_disabled);

	/**
	 *
	 * @param {any?} element
	 * @returns {element is {value: string}}
	 */
	function has_value(element) {
		return 'string' === typeof element?.value;
	}

	/**
	 * Listens to the change on the *child* input and sets the value of the
	 * named input, i.e. the checkbox. The child input should not have a name
	 * (which is kind of weird).
	 *
	 * There are weird timiing issues here if you want to listen to the bubbled
	 * change at the parent `form`.
	 *
	 *
	 * @param {Event} target
	 * @returns {void}
	 */
	function handle_input_change({ target }) {
		console.warn(
			'The change event is only triggered on user action, not by changing the value of an input programatically.'
		);
		if (has_value(target)) value = target.value;
	}
	/**
	 * @returns {void}
	 */
	function handle_enable() {
		disabled = !disabled;
		if (!disabled)
			tick().then(() => {
				/* How do I focus here? */
			});
	}
</script>

<div class="toggle">
	<div class="input">
		{#if input}
			{@render input(value, disabled, handle_input_change)}
		{:else}
			<input
				type="text"
				id={id || name}
				{value}
				{disabled}
				onchange={handle_input_change}
				placeholder=" "
				title={disabled ? 'Use the checkbox to enable' : ''}
			/>
		{/if}
	</div>
	<input
		type="checkbox"
		{name}
		{value}
		checked={!disabled}
		onchange={handle_enable}
		class="enabler"
	/>
</div>

<style>
	.toggle {
		display: flex;
		gap: 0.5em;
		align-items: baseline;
	}
	.toggle > .input {
		flex-grow: 1;
	}
</style>
