<script>
	import { page } from '$app/stores';
	/* @type {import('./$types').LayoutData} */
	// export let data;
</script>

<nav>
	<ul>
		<li><a href="/customers">Customers</a></li>
		<li><a href="/workloads">Workloads</a></li>
		<li><a href="/events">Events</a></li>
	</ul>
</nav>
<slot></slot>
<pre>{$page.url.pathname}</pre>
