<script>
	/** @type {import('./$types').PageData} */
	export let data;

	/**
	 * @param {Date} date 
	 * @returns {string}
	 */
	function format_date(date) {
		// TODO: i18n
		// https://stackoverflow.com/questions/25050034/get-iso-8601-using-intl-datetimeformat
		return new Intl.DateTimeFormat('en-US').format(date);
	}
</script>

<h1>Events</h1>
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
				<td>{format_date(event.happened_at)}</td>
			</tr>
		{/each}
	</tbody>
</table>
<pre>{JSON.stringify(data.events, null, 2)}</pre>