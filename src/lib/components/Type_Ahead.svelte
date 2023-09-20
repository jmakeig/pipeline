<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let name = '';
	/** @type { (by: string ) => Promise<unknown> }*/
	export let lookup;
	export let value;

	// Local state
	/** @type {any} */
	let candidates = [];
	let id;
	let state = 'uninitialized';
	/**
	 *
	 * @param event {Event}
	 */
	async function handle_input(event) {
		id = undefined;
		state = 'fetching';
		// console.log(event.target.value);
		candidates = await lookup(event.target.value);
		// console.log('candidates', candidates);
		state = 'done';
	}

	function debounce(func, timeout = 300, that = null) {
		state = 'input';
		/** @type {number} */
		let timer;
		return (...args) => {
			clearTimeout(timer);
			timer = setTimeout(() => {
				func.apply(that, args);
			}, timeout);
		};
	}
</script>

<input type="text" on:input={debounce(handle_input, 200)} {value} />
{state}
<ol>
	{#each candidates as candidate}
		<li>
			<button
				type="button"
				on:click|preventDefault={(event) => {
					id = candidate.id;
					value = candidate.match;
					dispatch('selected', { [name]: id });
				}}
			>
				{candidate.match}
			</button>
		</li>
	{/each}
</ol>
<input type="text" {name} bind:value={id} />
