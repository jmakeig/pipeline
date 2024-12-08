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
 * @returns {string | undefined}
 */
function s(value) {
	if (!exists(value)) return value;
	return String(value);
}

/**
 *
 * @param {any} value
 * @returns {Date | undefined}
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
		const outcome = s(form.get('outcome'));
		const happened_at = d(form.get('happened_at')) || undefined;

		/** @type {Partial<import('$lib/types').EventNew>} */
		const event = {
			// @ts-ignore
			[customer_workload[0]]: customer_workload[1],
			outcome,
			happened_at
		};
		if (!event.workload && !event.customer) {
			return fail(400, {
				validations: [{ for: 'customer_workload', message: 'Missing customer or workload' }],
				event
			});
		}
		if (!event.outcome) {
			return fail(400, {
				validations: [{ for: 'outcome', message: 'Outcome is required' }],
				event
			});
		}

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
