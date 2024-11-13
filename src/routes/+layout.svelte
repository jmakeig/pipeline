<script>
	import { page } from '$app/stores';
	/* @type {import('./$types').LayoutData} */
	// export let data;
</script>

<!-- TODO: https://charlesfreeborn.medium.com/how-to-build-a-responsive-nav-using-css-flexbox-3511cd936af9 -->
<nav>
	<ul>
		<li><a href="/">Home</a></li>
		<li><a href="/customers">Customers</a></li>
		<li><a href="/workloads">Workloads</a></li>
		<li><a href="/events">Events</a></li>
	</ul>
</nav>
<slot></slot>

<details>
	<summary>Page Metadata</summary>
	<pre>{$page.url.pathname}</pre>
</details>
