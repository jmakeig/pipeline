<script>
	import { slug } from '$lib/format.js';

	let { data, form } = $props();

	// prettier-ignore
	/** @type {import('$lib/types').Customer['name']} */
	let name = /** @as {string} */ ($state(form?.data.customer.name || ''));
</script>

<form method="POST">
	<div>
		<label for="name">Name</label>
		<input
			name="name"
			id="name"
			value={name}
			onchange={(evt) => (name = evt.currentTarget.value)}
			type="text"
		/>
		{slug(name)}
		<input name="label" value={slug(name)} id="label" type="hidden" />
	</div>
	<div>
		<label for="region">Region</label>
		<select name="region" id="region">
			<option></option>
			<option value="NORTHAM">NORTHAM</option>
			<option value="EMEA">EMEA</option>
			<option value="JAPAC">JAPAC</option>
			<option value="LATAM">LATAM</option>
		</select>
	</div>
	<div>
		<label for="segment">Segment</label>
		<select name="segment" id="segment">
			<option></option>
			<option value="select">Select</option>
			<option value="enterprise">Enterprise</option>
			<option value="corporate">Corporate</option>
			<option value="smb">SMB</option>
		</select>
	</div>
	<div><button>Create</button></div>
</form>
