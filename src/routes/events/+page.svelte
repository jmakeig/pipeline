<script>
	import TypeAhead from '$lib/components/TypeAhead.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	/**
	 *
	 * @param {string} [by]
	 * @returns {Promise<Array<{value: string, label: string}>>}
	 */
	async function find_customer_id(by) {
		const response = await fetch(`/customers?by=${by}`);
		const result = await response.json();
		return result;
	}

	/**
	 *
	 * @param {string} [by]
	 * @returns {Promise<Array<{value: string, label: string}>>}
	 */
	async function find_workload_id(by) {
		const response = await fetch(`/workloads?by=${by}`);
		const result = await response.json();
		return result;
	}
</script>

<h2>Events</h2>

<form>
	<label for="customer_id">Customer</label>
	<TypeAhead
		name="customer_id"
		value=""
		label=""
		lookup={find_customer_id}
		on:selected={(event) => {
			console.log(event.detail);
		}}
	/>
	<label for="workload_id">Workload</label>
	<TypeAhead
		name="workload_id"
		value=""
		label=""
		lookup={find_workload_id}
		on:selected={(event) => {
			console.log(event.detail);
		}}
	/>
	<button type="submit">Add</button>
</form>

<table>
	<thead>
		<th>Date</th>
		<th>Customer</th>
		<th>Workload</th>
	</thead>
	<tbody>
		{#each data.events as event, index (event.event_id)}
			<tr id={`event_` + event.event_id}>
				<td>{event.timestamp}</td>
				<td>{event.customer_id}</td>
				<td>{event.workload_id}</td>
			</tr>
		{:else}
			Nope
		{/each}
	</tbody>
</table>
