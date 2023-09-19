<script>
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<h2>Events</h2>
<table>
	<tbody>
		{#each data.events as event (event.event_id)}
			<tr id={`event_` + event.event_id}>
				<td>{event.event_id}</td>
			</tr>
		{:else}
			Nope
		{/each}
	</tbody>
</table>

<a href="/customers/new">New</a>
