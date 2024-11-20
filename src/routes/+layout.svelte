<script>
	import { page } from '$app/stores';
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
</header>

<slot></slot>

<footer>
	<details class="meta">
		<summary>Page Metadata</summary>
		<table>
			<tbody>
				<tr>
					<th role="rowheader"><code>$page.url.pathname</code></th>
					<td><code>{$page.url.pathname}</code></td>
				</tr>
				<tr>
					<th role="rowheader"><code>$page.status</code></th>
					<td><code>{$page.status}</code></td>
				</tr>
				<tr>
					<th role="rowheader"><code>$page.data</code></th>
					<td><pre>{JSON.stringify($page.data, null, 2)}</pre></td>
				</tr>
				<tr>
					<th role="rowheader"><code>$page.form?.validations</code></th>
					<td><pre>{JSON.stringify($page.form?.validations, null, 2)}</pre></td>
				</tr>
			</tbody>
		</table>
	</details>
</footer>

<style>
	header,
	footer {
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

	.meta {
		margin: 1em 0;
		padding: 1em;

		font-size: 0.9em;
		color: #666;
		background: #eee;
	}
	.meta table {
		width: auto;
		margin: 1em 0;
	}
	.meta table th[role='rowheader'] {
		vertical-align: top;
	}
</style>
