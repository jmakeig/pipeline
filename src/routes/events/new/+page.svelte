<script>
	/** @type {import('./$types').PageData} */
	export let data;

	/** @type {import('./$types').ActionData} */
	export let form;
</script>

<h1>New event</h1>
<form method="POST">
	<div class="control">
		<label for="workload">Workload</label>
		<select name="customer_workload" id="customer_workload" value={form?.customer_workload}>
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
	<div class="control">
		<label for="outcome">Outcome</label>
		<textarea name="outcome" id="outcome" placeholder=" " value={form?.outcome}></textarea>
	</div>
	<details>
		<summary>Advanced</summary>
		<fieldset>
			<legend>Advanced</legend>
			<div class="control">
				<label for="stage">Stage</label>
				<input name="stage" id="stage" placeholder=" " value={form?.stage} />
				<input type="checkbox" class="enabler" name={form?.enabled_stage} value="enabled_stage" checked={false}/>
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
