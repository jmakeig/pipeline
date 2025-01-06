<script>
	import { enhance } from '$app/forms';
	import Input from '$lib/components/Input.svelte';
	import { slug } from '$lib/format';
	import { has } from '$lib/validation';

	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	let { data, form } = $props();
	let label = $state(form?.customer.label);

	/**
	 *
	 * @param {Event} evt
	 */
	function handle_name_change(evt) {
		const { target } = evt;
		if (target instanceof HTMLInputElement) {
			label = slug(target.value);
		} else throw new TypeError(`${String(target)} is not an <input/> element`);
	}
</script>

<!--
use:enhance={() => {
	return async ({ update }) => {
		update({ reset: false });
	};
}}
-->
<form method="POST" action="?/new" class:invalid={has(form?.validations)} use:enhance={() => {
	return async ({ update }) => {
		update({ reset: false });
	};
}}>
	<h2>New Customer</h2>
	<Input
		name="name"
		value={form?.customer.name}
		label="Name"
		validations={form?.validations}
		onchange={handle_name_change}
		help="The unique name for the customer. Its short label{label
			? ', ' + label + ', '
			: ' '}also needs to be unique."
	/>
	<Input name="segment" label="Segment" validations={form?.validations}>
		<select name="segment" id="segment" value={form?.customer.segment ?? ''}>
			<option value="" selected></option>
			<option value="Select">Select</option>
			<option value="Enterprise">Enterprise</option>
			<option value="Corporate">Corporate</option>
			<option value="SMB">SMB</option>
		</select>
		{String(form?.customer.segment)}
	</Input>
	<Input name="region" label="Region" validations={form?.validations}>
		<select name="region" id="region" value={form?.customer.region ?? ''}>
			<option value="" selected></option>
			<option value="NORTHAM">North America (NORTHAM)</option>
			<option value="EMEA">Europe, Middle East, Africa (EMEA)</option>
		</select>
		{String(form?.customer.region)}
	</Input>
	<div class="control actions">
		<button class="default">Save</button>
	</div>
</form>
