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
	<details>
		<summary>Page Metadata</summary>
		<pre>{$page.url.pathname}</pre>
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
</style>
