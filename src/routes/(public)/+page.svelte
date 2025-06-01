<script>
	import { ago, currency, num } from '$lib/format';
	import Bar from '$lib/components/Bar.svelte';
	import Stage from '$lib/components/Stage.svelte';

	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();

	/* @type {HTMLDialogElement} */
	// let quick_add_dialog;
	// TODO: Use XState!
	/* @type {'open' | 'closed'}*/
	// let quick_add_state = $state('closed');

	/*
	$effect(() => {
		switch (quick_add_state) {
			case 'open':
				return quick_add_dialog.showModal();
			case 'closed':
				return quick_add_dialog.close();
			default:
				throw new Error(quick_add_state);
		}
	});
	*/
</script>

<header>
	<div class="uno">
		<h1>Pipeline</h1>
		<!--
		<button
			onclick={(evt) => {
				quick_add_state = 'open';
			}}>Quick Add</button
		>
		-->
		<form method="GET" action="/events/new">
			<input type="hidden" name="from" value="/" />
			<button>Quick Add</button>
		</form>
		<ol class="stages">
			{#each data.stages as stage}
				<li>
					<Stage value={stage} readonly>
						<strong>{stage.name}</strong>
						{#if stage.workloads.count > 0}
							{' - '}
							<small
								>{currency(stage.workloads.size, {
									style: 'thousands',
									minimumFractionDigits: 0,
									maximumFractionDigits: 2
								})} ({num(stage.workloads.count)})</small
							>
						{/if}
					</Stage>
				</li>
			{/each}
		</ol>
	</div>
	<div class="pipeline_size">
		<div>{currency(data.size, { round: 0 })}</div>
		<p>Estmated ARR for 2025</p>
	</div>
</header>
<section class="workloads">
	<table>
		<thead>
			<tr>
				<th class="sortable" role="columnheader">Customer</th>
				<th class="sortable" role="columnheader">Workload</th>
				<th class="sortable" role="columnheader">Stage</th>
				<th class="sortable" title="Annualized Recurring Revenue" role="columnheader">ARR</th>
				<th role="columnheader">Age</th>
				<th class="sortable" role="columnheader">Urgency</th>
				<th class="sortable" role="columnheader">Lead</th>
			</tr>
		</thead>
		<tbody>
			{#each data.follow_ups as follow_up}
				{@const max = data.follow_ups.reduce(
					/** @type {(m:number, w:{workload:import('$lib/types').Workload}) => number} */ (m, w) =>
						Math.max(m, w.workload.size || -Infinity),
					0
				)}
				<tr>
					<td role="cell">
						<a href="/customers/{follow_up.workload.customer.label}">
							{follow_up.workload.customer.name}
						</a>
					</td>
					<td role="cell"
						><a href="/workloads/{follow_up.workload.label}">{follow_up.workload.name}</a></td
					>
					<td role="cell">
						{#if follow_up.workload.stage}
							<Stage value={follow_up.workload.stage} readonly>
								{follow_up.workload.stage?.name}
							</Stage>
						{/if}
					</td>
					<td
						role="cell"
						style="text-align: right;"
						title={currency(follow_up.workload.size, { round: 0 })}
					>
						<Bar value={follow_up.workload.size} {max}>
							{currency(follow_up.workload.size, {
								style: 'thousands',
								minimumFractionDigits: 0,
								maximumFractionDigits: 2
							})}
						</Bar>
						<!--{currency(follow_up.workload.size, { round: 0, notation: 'compact', min: 1000 })}-->
					</td>
					<!-- <td class="numeric">{currency(follow_up.workload.size, { round: 0 })}</td> -->
					<td role="cell" class="numeric">
						{ago(follow_up.workload.last_touched, 'None')}
					</td>
					<td role="cell">{follow_up.urgency}</td>
					<td role="cell">{follow_up.workload.engagement_lead}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</section>

<!--
<dialog
	id="quick_add"
	bind:this={quick_add_dialog}
	onclose={(evt) => evt.preventDefault()}
>
	<h2>Quick Add</h2>
	<form method="dialog" action="?/quick_add">
		<div class="control">
			<label for="quick_edit_workload">Workload</label>
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
		<div class="control">
			<label for="quick_edit_outcome">Outcome</label>
			<textarea id="quick_edit_outcome" placeholder=" "></textarea>
		</div>
		<details>
			<summary>Advanced</summary>
			<fieldset>
				<legend>Advanced</legend>
				<div class="control">
					<label for="quick_edit_stage">Stage</label>
					<input id="quick_edit_stage" placeholder=" " />
					<input type="checkbox" class="enabler" />
				</div>
				<div class="control">
					<label for="quick_edit_size">Size</label>
					<input id="quick_edit_size" type="text" placeholder=" " />
					<input type="checkbox" class="enabler" />
				</div>
				<div class="control">
					<label for="quick_edit_target_date">Target Date</label>
					<input id="quick_edit_target_date" type="text" placeholder=" " />
					<input type="checkbox" class="enabler" />
				</div>
			</fieldset>
		</details>
		<div class="control actions">
			<button class="default" tabindex="0">Add</button>
			<button onclick={() => (quick_add_state = 'closed')} tabindex="0">Cancel</button>
		</div>
	</form>
</dialog>
-->
<style>
	header {
		display: flex;
		align-items: baseline;
		gap: 2em;
	}
	header .uno {
		flex-grow: 1;
	}
	.pipeline_size {
		background-color: var(--color-action-highlight);
		padding: 1em;
		border-radius: 1em;
	}
	.pipeline_size > div {
		font-size: 1.5em;
		font-weight: bold;
	}
	.pipeline_size > p {
		margin: 0.25em 0;
		font-size: 0.75em;
		text-wrap: nowrap;
	}

	ol.stages {
		list-style: none;
		padding: 0;

		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: flex-start;
		gap: 1em 2em;
	}
	/* ol.stages > li {} */
	section {
		margin: 0.5em 0;
	}

	/*
	dialog {
		min-width: 20em;
		padding: 2em 3em;
		border: solid 0.5px var(--color-border);
		border-radius: 1em;
		box-shadow:
			0 1px 3px 0 rgb(0 0 0 / 0.1),
			0 1px 2px -1px rgb(0 0 0 / 0.1);
	}
	dialog::backdrop {
		background-color: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(2px);
	}

	#quick_edit_outcome {
		min-width: 20em;
		height: 10em;
	}
	input[type='checkbox'].enabler {
		flex-basis: content;
	}
*/
</style>
