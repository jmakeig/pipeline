<script>
	import { enhance } from '$app/forms';
	import { exists } from '$lib/util';
	import { first, has } from '$lib/validation';
	import ToggledInput from '$lib/components/ToggledInput.svelte';
	import Stage from '$lib/components/Stage.svelte';

	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	let { data, form } = $props();

	/**
	 * @param {Partial<import('$lib/types').EventNew>} [event]
	 * @returns {string | undefined}
	 */
	function c_w(event) {
		if (!exists(event)) return undefined;
		if (event.workload) return `workload=${event.workload}`;
		if (event.customer) return `customer=${event.customer}`;
		return undefined;
	}
</script>

<h1>New event</h1>
<form method="POST" class:invalid={has(form?.validations)} use:enhance>
	<!-- This is to convey to the target page where to return -->
	<input type="hidden" name="from" value={data.from} />
	<div class="control" class:invalid={has(form?.validations, 'customer_workload')}>
		<label for="workload">Workload</label>
		<select name="customer_workload" id="customer_workload" value={c_w(form?.event)}>
			<optgroup label="Workloads">
				{#each data.customer_workloads.filter((/** @type {any} */ cw) => cw.workload) as customer_workload}
					<option value="workload={customer_workload.workload}"
						>{customer_workload.workload_name} ({customer_workload.customer_name})</option
					>
				{/each}
			</optgroup>
			<optgroup label="Customers">
				{#each data.customer_workloads.filter((/** @type {any} */ cw) => !cw.workload) as customer_workload}
					<option value="customer={customer_workload.customer}"
						>{customer_workload.workload_name} {customer_workload.customer_name}</option
					>
				{/each}
			</optgroup>
		</select>
	</div>
	<div class="control" class:invalid={has(form?.validations, 'outcome')}>
		<label for="outcome">Outcome</label>
		<div class="contents">
			<textarea name="outcome" id="outcome" placeholder=" " value={form?.event.outcome}></textarea>
			{#if has(form?.validations, 'outcome')}
				<p class="validation">{first(form?.validations, 'outcome')?.message}</p>
			{/if}
			<p class="helper">
				This is some text about the Outcome. It’s important, but may wrap if very, very long, so be
				careful in how you style it.
			</p>
		</div>
	</div>
	<details>
		<summary>Advanced</summary>
		<fieldset>
			<legend>Advanced</legend>
			<div class="control">
				<label for="stage">Stage</label>
				<div class="contents">
					<ToggledInput name="stage" value={form?.event.stage} placeholder=" ">
						<Stage value="" stages={data.stages} />
					</ToggledInput>
					{#if has(form?.validations, 'stage')}
						<p class="validation">{first(form?.validations, 'stage')?.message}</p>
					{/if}
					<p class="helper">
						This is some text about the Outcome. It’s important, but may wrap if very, very long, so
						be careful in how you style it.
					</p>
				</div>
			</div>
			<div class="control">
				<label for="size">Size</label>
				<div class="contents">
					<ToggledInput name="size" value={form?.event.size} placeholder=" " />
					{#if has(form?.validations, 'size')}
						<p class="validation">{first(form?.validations, 'size')?.message}</p>
					{/if}
					<!--
					<p class="helper">
						This is some text about the Outcome. It’s important, but may wrap if very, very long, so
						be careful in how you style it.
					</p> -->
				</div>
			</div>
		</fieldset>
	</details>
	<div class="control actions">
		<button>Save</button>
	</div>
</form>

<style>
	#outcome {
		min-width: 20em;
		height: 10em;
	}
</style>
