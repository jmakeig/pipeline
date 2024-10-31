<script>
	/** @type {import('./$types').PageData} */
	export let data;

	/** @type {import('./$types').ActionData} */
	export let form;
</script>

<h1>New event</h1>
<form method="POST">
	<div>
		<label for="customer_workload">Customer</label>
		<select id="customer_workload" name="customer_workload">
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
	<div>
		<label for="outcome">Outcome</label>
		<textarea id="outcome" name="outcome"></textarea>
	</div>
	<div>
		<button>Save</button>
	</div>
</form>
