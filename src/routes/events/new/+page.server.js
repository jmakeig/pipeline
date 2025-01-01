import { add_event_workload, get_customer_workloads, get_stages_summary } from '$lib/server/api';
import { exists } from '$lib/util';
import { has } from '$lib/validation';
import { fail, redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ request }) {
	const from = new URL(request.url).searchParams.get('from') ?? '/events';

	const customer_workloads = await get_customer_workloads();
	const stages = await get_stages_summary();
	return { customer_workloads, stages, from };
}

/**
 *
 * @param {any} value
 * @returns {string | undefined}
 */
function s(value) {
	if (!exists(value)) return undefined;
	return String(value);
}

/**
 *
 * @param {any} value
 * @returns {Date | undefined}
 */
function d(value) {
	if (!exists(value)) return undefined;
	return new Date(Date.parse(String(value)));
}

/**
 *
 * @param {any} value
 * @returns {number | undefined}
 */
function n(value) {
	if (!exists(value)) return undefined;
	return parseFloat(value);
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
	default: async ({ request }) => {
		const form = await request.formData();

		// Event
		const customer_workload = s(form.get('customer_workload'))?.split('=');
		const outcome = s(form.get('outcome'));
		// const happened_at = d(form.get('happened_at'));
		const event = {
			// @ts-ignore
			[customer_workload[0]]: customer_workload[1],
			outcome
		};

		/**
		 * @template T
		 * @param {FormData} form_data
		 * @param {string} name
		 * @param {(value:any) => T} [typed]
		 * @returns {T | undefined | symbol}
		 */
		function form_value(form_data, name, typed = (v) => v) {
			/*
				If the input is not submitted (i.e. null === formData#get(…)), then ignore
				Else
					If it’s blank, then flag as delete
					If it’s invalid, then fail with validation
					Else submit
			*/
			const value = form_data.get(name);
			// console.log('value', value);
			if (null === value) return undefined;
			// If a checkbox doesn’t have a value, the browser sends the string, `'on'`
			if ('on' === value || '' === value) return Symbol.for('DELETED');
			// console.log('typed(value)', typed(value));
			return typed(value);
		}

		const stage = form_value(form, 'stage', parseFloat);
		const size = form_value(form, 'size', parseFloat);

		/** @type {import('$lib/types').Validation[]} */
		const validations = [];
		if (!event.workload && !event.customer) {
			validations.push({ for: 'customer_workload', message: 'Missing customer or workload' });
		}
		if (!event.outcome) {
			validations.push({ for: 'outcome', message: 'Outcome is required' });
		}
		if (Number.isNaN(stage)) {
			validations.push({ for: 'stage', message: `'${form.get('stage')}' is not a number.` });
		}
		if (Number.isNaN(size)) {
			validations.push({ for: 'size', message: `'${form.get('size')}' is not a number.` });
		} else if ('number' === typeof size && size <= 0) {
			validations.push({ for: 'size', message: `'${size}' must be greater than zero.` });
		}

		console.log('add_event_workload', event.workload, event.outcome, stage, size);

		if (has(validations)) {
			return fail(400, {
				validations,
				event
			});
		}

		/**
		 * Pedantic type gurad to determine if a value is valid input for a `WorkloadAttributeAction[stage]`.
		 * @typedef {import('$lib/types').WorkloadAttributeAction} WorkloadAttributeAction
		 * @param {number | symbol | undefined} value
		 * @returns {value is WorkloadAttributeAction['stage']}
		 */
		function is_stagish(value) {
			if (undefined === value) return true;
			if (Symbol.for('DELETE') === value) return true;
			const stages = [0, 1, 2, 3, 4, 5, 97, 98, 99, 100];
			for (const st of stages) {
				if (st === value) return true;
			}
			return false;
		}

		if (is_stagish(stage)) {
			return await add_event_workload(event, { stage, size });
		}
		throw new TypeError(`${String(stage)} is not SalesStage['stage']`);
		/*
		const params = new URLSearchParams();
		if (new_event.event) params.append('event', new_event.event);
		redirect(303, `${form.get('from')}?${params.toString()}`);
		*/
	}
};
