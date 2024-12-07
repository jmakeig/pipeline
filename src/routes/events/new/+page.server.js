import { add_event, get_customer_workloads } from '$lib/server/api';
import { exists } from '$lib/util';
import { fail, redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const customer_workloads = await get_customer_workloads();
	return { customer_workloads };
}

/**
 *
 * @param {any} value
 * @returns {string?}
 */
function s(value) {
	if (!exists(value)) return value;
	return String(value);
}

/**
 *
 * @param {any} value
 * @returns {Date?}
 */
function d(value) {
	if (!exists(value)) return value;
	return new Date(Date.parse(String(value)));
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
	default: async ({ request }) => {
		const form = await request.formData();

		const customer_workload = s(form.get('customer_workload'))?.split('=');
		if (!customer_workload) {
			return fail(400, {
				validations: [{ for: 'customer_workload', message: 'Missing customer or workload' }]
			});
		}

		const outcome = s(form.get('outcome'));
		if (!outcome) {
			return fail(400, {
				validations: [{ for: 'outcome', message: 'Outcome is the most important pieces of data' }]
			});
		}
		const happened_at = d(form.get('happened_at')) || undefined;

		/** @type {import('$lib/types').EventNew} */
		const event = {
			[customer_workload[0]]: customer_workload[1],
			outcome,
			happened_at
		};
		const new_event = await add_event(
			event.workload || null,
			event.customer || null,
			event.outcome,
			event.happened_at
		);
		console.log('new_event', new_event);
		// redirect(303, `/events?which=${new_event.event}`);
	}
};
