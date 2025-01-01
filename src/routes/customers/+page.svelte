<script>
	import { enhance } from '$app/forms';
	import { first, has } from '$lib/validation';

	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	let { data, form } = $props();
</script>

<h1>Customers</h1>
<table>
	<thead>
		<tr>
			<th>Customer</th>
			<th>Region</th>
			<th>Segment</th>
		</tr>
	</thead>
	<tbody>
		{#each data.customers as customer}
			<tr>
				<td><a href="/customers/{customer.label}">{customer.name}</a></td>
				<td>{customer.region}</td>
				<td>{customer.segment}</td>
			</tr>
		{/each}
	</tbody>
</table>

{#snippet control(
	/** @type {string} */
	name,
	/** @type {string | undefined} */
	value,
	/** @type {string} */
	label = name,
	/** @type {import('$lib/types').Validation[]} */
	validations = [],
	/**
	 * Optional child input, e.g. `select` or custom control.
	 * @type {import('svelte').Snippet<[name: string, value?: string]> | undefined}
	 */
	input
)}
	<div class="control" class:invalid={has(validations, name)}>
		<label for={name}>{label}</label>
		<div class="contents">
			{#if input}
				{@render input(name, value)}
			{:else}
				<input {name} id={name} {value} placeholder=" " />
			{/if}
			{#if has(validations, name)}
				<p class="validation">{first(validations, name)?.message}</p>
			{/if}
		</div>
	</div>
{/snippet}
{#snippet region(/** @type {string} */ name, /** @type {string | undefined} */ value)}
	<select {name} id={name} {value}>
		<option value="NORTHAM">North America (NORTHAM)</option>
		<option value="EMEA">Europe, Middle East, Africa (EMEA)</option>
	</select>
{/snippet}
{#snippet segment(/** @type {string} */ name, /** @type {string | undefined} */ value)}
	<select {name} id={name} {value}>
		<option value="Select">Select</option>
		<option value="Enterprise">Enterprise</option>
	</select>
{/snippet}

<form method="POST" action="?/new" class:invalid={has(form?.validations)} use:enhance>
	<h2>New Customer</h2>
	{@render control('name', form?.customer.name, 'Name', form?.validations)}
	{@render control('label', form?.customer.label, 'Label', form?.validations)}
	{@render control(
		'region',
		form?.customer.region,
		'Region',
		form?.validations,
		/** @type {import('svelte').Snippet<[name: string, value: string | undefined]> */ region
	)}
	{@render control(
		'segment',
		form?.customer.segment,
		'Segment',
		form?.validations,
		/** @type {import('svelte').Snippet<[name: string, value: string | undefined]> */ segment
	)}
	<div class="control actions">
		<button class="default">Save</button>
	</div>
</form>
