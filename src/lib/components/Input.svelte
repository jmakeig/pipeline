<script>
	import { first, has } from '$lib/validation';

	/** @type {{name:string; value?: string?; label: string, validations?: import('$lib/types').Validation[], children?: import('svelte').Snippet; help?: string; onchange?: (evt:Event) => void}}*/
	let { name, value, label = name, validations = [], children, help, onchange } = $props();
</script>

<div class="control" class:invalid={has(validations, name)}>
	<label for={name}>{label}</label>
	<div class="contents">
		{#if children}
			<!-- THIS CAN’T PASS THE VALUE THROUGH -->
			{@render children()}
		{:else}
			<input
				{name}
				id={name}
				{value}
				{onchange}
				placeholder=" "
				aria-invalid={has(validations, name)}
				aria-errormessage={has(validations, name) ? `${name}-error` : undefined}
				aria-describedby="{name}-help"
				autocomplete="off"
				autocapitalize="off"
				spellcheck="false"
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
