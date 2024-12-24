<script>
	let {
		name,
		value: _value,
		enabled: _enabled = false,
		id = name,
		type = 'text',
		placeholder = ''
	} = $props();
	let enabled = $state(Boolean(_enabled));
	let value = $state(_value);

	//$inspect(_enabled).with(console.trace);
</script>
<span>
	<input
		{id}
		{type}
		{value}
		disabled={!enabled}
		onchange={(evt) => (_value = evt.currentTarget?.value)}
		{placeholder}
	/>
	<input
		type="checkbox"
		{name}
		checked={enabled}
		{value}
		onchange={(evt) => (enabled = !enabled)}
	/>
</span>
<style>
	span {
		display: flex;
		gap: 0.5em;
		align-items: baseline;
		flex-grow: 1;
	}
	input[type='text'] {
		flex-grow: 1;
	}
</style>
