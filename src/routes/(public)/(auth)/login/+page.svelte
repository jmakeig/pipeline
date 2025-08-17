<script>
	import { has } from '$lib/validation';
	import Input from '$lib/components/Input.svelte';

	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	let { data, form } = $props();

	console.log('form.validations', form?.validations);
</script>

<form action="?/login" method="POST">
	{#if has(form?.validations)}<p style="color: var(--color-error);">Nope!</p>{/if}
	<Input
		name="user_name"
		value={form?.login?.user_name}
		label="User"
		validations={form?.validations}
	/>
	<Input name="password" label="Password" validations={form?.validations}>
		<input type="password" name="password" value="" />
	</Input>

	<input type="hidden" name="to" value={data.to} />
	<div class="actions">
		<button>Login</button>
	</div>
</form>a
