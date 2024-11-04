<script>
	import { slug } from '$lib/format';

	let { data } = $props();

	/** @type {string} */
	let name = $state('');
</script>

<h1>New Workload for {data.customer.name}</h1>
<form method="POST">
	<input name="customer" id="customer" value={data.customer.customer} type="text" />
	<div>
		<label for="name">Name</label>
		<input
			name="name"
			value={name}
			id="name"
			onchange={({ target }) => (name = target?.value)}
			type="text"
			spellcheck="false"
			autocomplete="off"
		/>
		{slug(name)}
		<input name="label" value={slug(name)} id="label" type="hidden" />
	</div>
	<div>
		<button>Create</button>
	</div>
</form>
