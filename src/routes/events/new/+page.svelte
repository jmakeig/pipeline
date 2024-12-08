<script>
	import { enhance } from '$app/forms';
	import { exists } from '$lib/util';
	import { by, first, has } from '$lib/validation';

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
		<label for="outcome">Outcome asdf asdf adf adf adf adf adfadf</label>
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
				<input name="stage" id="stage" placeholder=" " value={form?.event.stage} />
				<input
					type="checkbox"
					class="enabler"
					name={form?.event.enabled_stage}
					value="enabled_stage"
					checked={false}
				/>
			</div>
			<div class="control">
				<label for="size">Size</label>
				<input name="size" id="size" type="text" placeholder=" " />
				<input type="checkbox" class="enabler" />
			</div>
			<div class="control">
				<label for="target_date">Target Date</label>
				<input name="target_date" id="target_date" type="text" placeholder=" " />
				<input type="checkbox" class="enabler" />
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
	input[type='checkbox'].enabler {
		flex-basis: content;
	}
</style>
