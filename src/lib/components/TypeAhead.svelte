<script>
	/** @typedef {{value: string, label: string}[]} LookupList */

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	const rand = (Math.random() + 1).toString(36).substring(7); // Default for name and id
	export let name = rand;
	export let id = rand;
	/** @type { string | undefined } */
	export let value;
	/** @type { string | undefined } */
	export let label;
	/** @type { LookupList } */
	export let defaults = [];
	/** @type { (by?: string) => Promise<LookupList>  } */
	export let lookup = async function () {
		return defaults;
	};

	/**
	 * @param s {string}
	 */
	function set_state(s) {
		state = s;
		//console.log('state', state, new Date);
	}

	/** @type { (by?: string) => Promise<LookupList>  } */
	async function _lookup(by) {
		if ('' === by) {
			return defaults;
		}
		set_state('fetching');
		return await lookup(by);
	}

	// Local state
	let list = defaults;
	let state = 'idle'; // Poor man’s state machine

	/**
	 *
	 * @param {Event} event
	 */
	async function handle_input(event) {
		//console.log('input', state,  new Date);
		set_state('inputting');
		// @ts-ignore
		const input = event.target.value;
		value = undefined;
		// The ordering here is important.
		// Because _lookup is async the change event may have happeded while waiting
		// This will result in an extra lookup that we ignore, but a less janky experience
		const tmp = await _lookup(input);
		if ('selected' !== state) list = tmp;
		else set_state('updated');
	}

	/**
	 *
	 * @param {Event} event
	 */
	function handle_change(event) {
		// @ts-ignore
		const input = event.target?.value;
		value = list.find((option) => option.label === input)?.value;
		list = defaults;
		set_state('selected');
		dispatch('selected', { value, label: input });
	}

	/**
	 * Debounces an event handler
	 *
	 * @param {function} callback
	 * @param {number} delay
	 * @param {any[]} args
	 * @returns {(event: Event) => void}
	 */
	function debounce(callback, delay = 250, ...args) {
		let clear = true;
		const timerClear = () => (clear = true);
		return (event) => {
			if (clear) {
				clear = false;
				setTimeout(timerClear, delay);
				callback(event, ...args);
			}
		};
	}
</script>

<!--<p>{state}</p>-->
<input
	{id}
	list={`${name}-type-ahead`}
	value={label}
	on:input={debounce(handle_input)}
	on:change={handle_change}
	class:fetching={'fetching' === state}
	autocomplete="off"
	spellcheck="false"
/>
<datalist id={`${name}-type-ahead`}>
	{#each list as item}
		<option data-value={item.value}>{item.label}</option>
	{/each}
</datalist>
<input type="hidden" {name} value={value || ''} style="opacity: 0.15;" />

<!--
<h2>Values</h2>
<ol>
	{#each list as item}
		<li>{item.label}</li>
	{/each}
</ol>
-->
<style>
	input.fetching {
		background-color: #666;
	}
</style>
