<script>
	import { dev } from '$app/environment';
	import { page } from '$app/state';
	/* @type {{ data: import('./$types').PageData }} */
	// let { data } = $props();

	let { data, children } = $props();
</script>

<header>
	<!-- TODO: https://charlesfreeborn.medium.com/how-to-build-a-responsive-nav-using-css-flexbox-3511cd936af9 -->
	<nav>
		<ul>
			<li><a href="/">Home</a></li>
			<li><a href="/customers">Customers</a></li>
			<li><a href="/workloads">Workloads</a></li>
			<li><a href="/events">Events</a></li>
		</ul>
	</nav>
	<search>
		<form method="get" action="/search" data-sveltekit-reload>
			<input type="search" name="q" value={data.q} title="Search…" />
		</form>
	</search>
</header>

{@render children()}

{#if dev}
<footer>
	<details class="debug">
		<summary>Page Metadata</summary>
		<table>
			<tbody>
				<tr>
					<th role="rowheader"><code>page.url.pathname</code></th>
					<td><code>{page.url.pathname}</code></td>
				</tr>
				<tr>
					<th role="rowheader"><code>page.url.search</code></th>
					<td><code>{page.url.search}</code></td>
				</tr>
				<tr>
					<th role="rowheader"><code>page.status</code></th>
					<td><code>{page.status}</code></td>
				</tr>
				<tr>
					<th role="rowheader"><code>page.data</code></th>
					<td><pre>{JSON.stringify(page.data, null, 2)}</pre></td>
				</tr>
				<tr>
					<th role="rowheader"><code>page.form</code></th>
					<td><pre>{JSON.stringify(page.form, null, 2)}</pre></td>
				</tr>
			</tbody>
		</table>
	</details>
</footer>
{/if}

<style>
	header,
	footer {
		display: flex;
		gap: 1em;
		margin: 1em 0;
	}
	nav > ul {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: flex-start;
		gap: 1em;

		list-style: none;
		margin: 0;
		padding: 0;
	}
	nav > ul > li {
		margin: 0;
	}
	header > search {
		width: 50%;
		margin-left: auto;
	}
	header > search input[type='search'] {
		width: 100%;
	}

	.debug {
		margin: 2rem 0;
		padding: 1em;

		color: #666;
		background: #eee;

		border-radius: 0.5em;
	}
	.debug table {
		width: 100%;
		/* https://stackoverflow.com/a/50782523/563324 */
		table-layout: fixed;
		margin: 1em 0;
	}
	.debug table th[role='rowheader'] {
		width: 20em;
		vertical-align: top;
	}
	.debug pre {
		overflow: auto;
	}
</style>
