<script>
	export const ssr = true;
	export const csr = true;

	if (!csr) {
		console.warn(`Client-side rendering is DISABLED in root layout`);
	}
</script>

<h1>Pipeline</h1>
<slot />
