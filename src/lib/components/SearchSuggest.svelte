<script>
	import ufuzzy from '@leeoniya/ufuzzy';

	/**
	 *
	 * @template {{name: string}} Named
	 * @param {Array<Named>} list
	 * @param {string} input
	 * @param {(item: Named) => string} [flatten]
	 * @param {number} [limit=10]
	 * @returns {Array<Named>}
	 */
	function search(list, input, flatten = (item) => item.name, limit = 10) {
		if ('' === input) return [];
		const fuzzy = new ufuzzy();
		const haystack = list.map(flatten); // Mapped to flat list

		const indexes = fuzzy.filter(haystack, input);
		if (null === indexes) return [];
		const info = fuzzy.info(indexes, haystack, input);
		const order = fuzzy.sort(info, haystack, input);

		// YIKES! This two-level indirection was not at all obvious
		return order.map((o) => info.idx[o]).map((i) => list[i]);
	}

	/**
	 * @template {{id: string, name: string}} Entity
	 * @type {{name: string, entities: Array<Entity>, renderer: import('svelte').Snippet<[Entity]> }}
	 */
	let { name, entities = [], renderer } = $props();

	/**
	 * @template {{id: string, name: string}} Entity
	 * @type {Array<Entity>}
	 */
	let list = $state(entities);
	/** @type {number | null} */
	let selected = $state(null);
	/** @type {'up' | 'down' | null} */
	let direction = $state(null);
	/** @type {'hidden' | 'visible'} */
	let interactive = $state('hidden'); // hidden, visible

	$effect(() => {
		//console.log(selected);
		if (null === selected) {
			const el = document.querySelector('ol');
			console.log(selected, el, el?.scrollTop);
			if (el) el.scrollTop = 0;
		} else {
			const el = document.querySelector(`li[data-index="${selected}"`);
			if (el) {
				/** @type {{down: ScrollIntoViewOptions, up: ScrollIntoViewOptions}} */
				const options = {
					down: {
						block: 'end',
						behavior: 'auto'
					},
					up: {
						block: 'nearest',
						behavior: 'auto'
					}
				};
				if (direction) el.scrollIntoView(options[direction]);
			}
		}
	});

	/**
	 *
	 * @param {InputEvent} target
	 */
	function handle_input({ target }) {
		list = search(entities, /** @type {HTMLInputElement} */ (target)?.value);
		selected = null;
		if ('' === /** @type {HTMLInputElement} */ (target)?.value) interactive = 'hidden';
		else interactive = 'visible';
	}

	/**
	 *
	 * @param {KeyboardEvent} event
	 * @returns {void}
	 */
	function handle_key(event) {
		// console.log(event.key);

		const DOWN = 'ArrowDown';
		const UP = 'ArrowUp';
		const ENTER = 'Enter';
		const ESCAPE = 'Escape';

		const target = event.target;
		if (null === target) throw new ReferenceError();

		if ([DOWN, UP, ENTER, ESCAPE].includes(event.key)) {
			event.preventDefault();
		}

		if (DOWN === event.key) {
			direction = 'down';
			selected = bound(increment(selected, 1), list);
		}
		if (UP === event.key) {
			direction = 'up';
			selected = bound(increment(selected, -1), list);
		}

		if (ESCAPE === event.key) {
			selected = null;
			/** @type {HTMLInputElement} */ (target).value = '';
		}

		// TODO: Need to implment this same behavoir for clicking an item in the list
		if (ENTER === event.key) {
			interactive = 'hidden';
			const target = event.target;
			/** @type {HTMLInputElement} */ (target).value = null === selected ? '' : list[selected].name;
		}

		if ([ENTER, ESCAPE].includes(event.key)) {
			interactive = 'hidden';
			selected = null;
			/** @type {HTMLInputElement} */ (target).blur();
		}
	}

	/**
	 *
	 * @param {FocusEvent} target
	 */
	function handle_focus({ target }) {
		list = search(list, /** @type {HTMLInputElement} */ (target).value);
		interactive = '' === /** @type {HTMLInputElement} */ (target).value ? 'hidden' : 'visible';
	}

	/**
	 *
	 * @param {number} index
	 * @param {Array<unknown>}collection
	 * @returns {number}
	 */
	function bound(index, collection) {
		if (index < 0) return 0;
		return Math.min(index, collection.length - 1);
	}

	/**
	 *
	 * @param {number | null} index
	 * @param {number} [amount=1]
	 * @returns {number}
	 */
	function increment(index, amount = 1) {
		if (null === index) return 0;
		return index + amount;
	}
	/**
	 * Ignores `null` and `undefined` parameters.
	 * @param {string | null} type
	 * @param {string | null} id
	 * @returns {string | null}
	 */
	function format_id(type, id) {
		if (!type || !id) return null;
		return type + '=' + id;
	}

	// Is this actually necessary? Can oninput keep up with typing?
	/*
	function debounce(func, delay) {
		let timeoutId;
		return function (...args) {
			const context = this;
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				func.apply(context, args);
			}, delay);
		};
	}
	*/

	/**
	 * Need the layer of abstraction here to allow the handler
	 * to close over the index of the item.
	 *
	 * @param {(fn: Event) => void} fn
	 * @returns {(fn: Event) => void}
	 */
	function handle_click(fn) {
		return function (event) {
			event.preventDefault();
			fn.call(null, event);
		};
	}
</script>

{#snippet label(/** @type {{name: string; id: string;}} */ option)}
	{#if option}{option.name} (<code>{option.id}</code>){/if}
{/snippet}
<h1>{selected}</h1>
<div class="control">
	x
	<input type="search" oninput={handle_input} onkeydown={handle_key} onfocus={handle_focus} />
	<!-- aria-expanded, aria-hidden -->
	<ol class="picker" class:interactive={'visible' === interactive}>
		{#each list as option, index}
			<li class:selected={selected === index} data-index={index}>
				<button onclick={handle_click(() => (selected = index))}>
					{#if renderer}
						{@render renderer(option)}
					{:else}
						{@render label(option)}
					{/if}
				</button>
			</li>
		{:else}
			<p>nope!</p>
		{/each}
	</ol>
	<input type="hidden" {name} value={format_id(list[selected]?.type, list[selected]?.id)} />
	<!-- {@render label(list[selected])} -->
</div>

<style>
	.selected {
		outline: 5px auto Highlight;
		outline: 5px auto -webkit-focus-ring-color;
	}
	.picker {
		position: absolute;
		top: 1.55em;
		display: none;
		background: white;

		padding: 0.5em;
		padding-bottom: 1em;
		box-shadow:
			0 4px 6px -1px rgb(0 0 0 / 0.1),
			0 2px 4px -2px rgb(0 0 0 / 0.1);
		max-height: 10em;
		overflow-y: auto; /* Yuck! */

		border: solid 0.5px #ddd;
	}
	.picker li {
		margin: 0.5rem 0;
	}
	.picker button {
		font-family: inherit;
		font-size: inherit;
		border: none;
		background: none;
		outline: none;
	}
	.picker.interactive {
		display: block;
	}
	input[type='search'] {
		font-family: inherit;
		font-size: inherit;
		color: inherit;
		line-height: 1.25rem;
		padding: 0.25rem;
	}
</style>
