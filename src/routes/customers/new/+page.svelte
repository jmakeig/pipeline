<script>
	import { enhance } from '$app/forms';
	import Input from '$lib/components/Input.svelte';
	import { has } from '$lib/validation';

	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	let { data, form } = $props();
	/*
	let name = $state(form?.customer.name);
	let dirty = $state(false);
	let label = $derived.by(() => {
		if (form?.customer.label && !dirty) return form?.customer.label;
		return slug(name ?? '');
	});
	$inspect(dirty, label);
*/

	/**
	 *
	 * @param {Event} evt
	 */
	function handle_name_change(evt) {
		/*
		const { target } = evt;
		if (target instanceof HTMLInputElement) {
			dirty = true;
			name = target.value;
		} else throw new TypeError(`${String(target)} is not an <input/> element`);
		*/
	}
</script>

<!--
<div style="position: absolute; top: 1em; right: 1em; padding: 1em; background: yellow;">
	{label}
</div>
-->
<!-- ={() => {
	return ({ update }) => update({ reset: false });
}} -->
<form method="POST" action="?/new" class:invalid={has(form?.validations)} use:enhance>
	<!--
={() => {
	return ({ update }) => update({ reset: false });
}}
-->
	<!--
onsubmit={(evt) => {
	dirty = false;
	return;
}}
-->
	<h2>New Customer</h2>
	<Input
		name="name"
		value={form?.customer.name}
		label="Name"
		validations={form?.validations}
		onchange={handle_name_change}
	/>
	<Input
		name="label"
		label="Label"
		validations={form?.validations}
		help="'The short name for the customer that will appear in links.'"
	>
		<input value={form?.customer.label ?? ' '} readonly />
	</Input>
	<Input name="segment" label="Segment" validations={form?.validations}>
		<select name="segment" id="segment" value={form?.customer.segment}>
			<option value=""></option>
			<option value="Select">Select</option>
			<option value="Enterprise">Enterprise</option>
			<option value="Corporate">Corporate</option>
			<option value="SMB">SMB</option>
		</select>
	</Input>
	<Input name="region" label="Region" validations={form?.validations}>
		<select name="region" id="region" value={form?.customer.region}>
			<option value=""></option>
			<option value="NORTHAM">North America (NORTHAM)</option>
			<option value="EMEA">Europe, Middle East, Africa (EMEA)</option>
		</select>
	</Input>
	<div class="control actions">
		<button class="default">Save</button>
	</div>
</form>
