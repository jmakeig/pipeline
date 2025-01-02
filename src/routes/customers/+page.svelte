<script>
	import { enhance } from '$app/forms';
	import { first, has } from '$lib/validation';

	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	let { data, form } = $props();

	/**
	 * @template {unknown[]} T
	 * @typedef {import('svelte').Snippet<T>} Snippet<T>
	 */
	/**
	 * @typedef {import('$lib/types').Validation} Validation
	 * @typedef {Snippet<[name: string, value: string | undefined]>} ControlInput
	 */
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
	/** @type {Validation[]} */
	validations = [],
	/**
	 * Optional child input, e.g. `select` or custom control.
	 * @type {Snippet<[name: string, value?: string]> | undefined}
	 */
	input,
	/** @type {string | undefined} */
	help
)}
	<div class="control" class:invalid={has(validations, name)}>
		<label for={name}>{label}</label>
		<div class="contents">
			{#if input}
				{@render input(name, value)}
			{:else}
				<input
					{name}
					id={name}
					{value}
					placeholder=" "
					aria-invalid={has(validations, name)}
					aria-errormessage={has(validations, name) ? `${name}-error` : undefined}
					aria-describedby="{name}-help"
				/>
			{/if}
			{#if has(validations, name)}
				<p class="validation" id="{name}-error" aria-live="assertive">
					{first(validations, name)?.message}
				</p>
			{/if}
			{#if help}
				<p class="helper" id="{name}-help">{help}</p>
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
	{@render control(
		'label',
		form?.customer.label,
		'Label',
		form?.validations,
		undefined,
		'The short name for the customer that will appear in links.'
	)}
	{@render control(
		'region',
		form?.customer.region,
		'Region',
		form?.validations,
		/** @type {ControlInput} */ region
	)}
	{@render control(
		'segment',
		form?.customer.segment,
		'Segment',
		form?.validations,
		/** @type {ControlInput} */ segment
	)}
	<div class="control actions">
		<button class="default">Save</button>
	</div>
</form>
