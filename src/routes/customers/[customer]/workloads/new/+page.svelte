<script>
	import { slug } from '$lib/format';
	import * as valid from '$lib/validation';

	let { data, form } = $props();

	/** @type {string} */
	let name = $state(form?.data.workload.name || '');
</script>

<h1>New Workload for {data.customer.name}</h1>
<form method="POST">
	{#if valid.has(form?.validations)}
		<p class="error">Error: {valid.first(form?.validations)?.message}</p>
	{/if}
	<input name="customer" id="customer" value={data.customer.customer} type="text" />
	<div>
		{#if valid.by(form?.validations, 'name')}
			<p class="error">{form?.validations.filter((v) => 'name' === v.for)[0].message}</p>
		{/if}
		<label for="name">Name</label>
		<input
			name="name"
			value={name}
			id="name"
			onchange={({ currentTarget }) => (name = currentTarget.value)}
			class:error={valid.has(form?.validations, 'name')}
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

<details>
	<summary><code>form</code></summary>
	<pre>{JSON.stringify(form, null, 2)}</pre>
</details>

<style>
	.error {
		background-color: red;
	}
</style>
