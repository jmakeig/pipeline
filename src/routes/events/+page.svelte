<script>
	import Type_Ahead from '$lib/components/Type_Ahead.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	/**
	 *
	 * @param match {string}
	 * @returns {Promise<string | undefined>}
	 */
	async function find_customer_id(match) {
		const response = await fetch(`/customers?by=${match}`);
		const result = await response.json();
		return result;
	}
</script>

<h2>Events</h2>

<form>
	Customer <Type_Ahead
		name="customer_id"
		value=""
		lookup={find_customer_id}
		on:selected={(event) => {
			console.log(event.detail);
		}}
	/>
	Workload <input name="workload_id" />
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
