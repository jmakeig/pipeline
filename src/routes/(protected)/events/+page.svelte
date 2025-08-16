<script>
	import { ago } from '$lib/format';

	let { data } = $props();

	let which = null;
	// $: which = $page.url.searchParams.get('which');
</script>

<h1>Events</h1>
<table>
	<thead>
		<tr>
			<th></th>
			<th>Customer</th>
			<th>Workload</th>
			<th>Outcome</th>
			<th>Date</th>
		</tr>
	</thead>
	<tbody>
		{#each data.events as event, i}
			<tr data-event={event.event} class:selected={which === event.event}>
				<td>{i+1}</td>
				<td>
					<a href="/customers/{event.customer?.label}"
						>{event.customer?.name ?? event.workload?.customer.name}</a
					></td
				>
				<td>
					<a href="/workloads/{event.customer?.label}/{event.workload?.label}"
						>{event.workload?.name}</a
					>
				</td>
				<td>{event.outcome || ''}</td>
				<td style="white-space: nowrap;">{ago(event.happened_at)}</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	tr.selected td {
		background: yellow;
	}
</style>
