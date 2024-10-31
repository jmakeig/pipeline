<script>
	import { page } from '$app/stores';
	import { ago } from '$lib/format';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<h1>Events</h1>
<p><a href="{$page.url.pathname}/new">New</a></p>
<table>
	<thead>
		<tr>
			<th>Customer</th>
			<th>Workload</th>
			<th>Outcome</th>
			<th>Date</th>
		</tr>
	</thead>
	<tbody>
		{#each data.events as event}
			<tr>
				<td><a href="/customers/{event.customer_label}">{event.customer_name}</a></td>
				<td>
					<a href="/workloads/{event.customer_label}/{event.workload_label}"
						>{event.workload_name}</a
					>
				</td>
				<td>{event.outcome || ''}</td>
				<td>{ago(event.happened_at)}</td>
			</tr>
		{/each}
	</tbody>
</table>
<pre>{JSON.stringify(data.events, null, 2)}</pre>
