import { add_event, get_customer_workloads } from '$lib/server/api';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const customer_workloads = await get_customer_workloads();
	return { customer_workloads };
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		const customer_workload = form.get('customer_workload').split('=');
		const event = {
			[customer_workload[0]]: customer_workload[1],
			outcome: form.get('outcome'),
			happened_at: form.get('happened_at') || undefined
		};
		const new_event = await add_event(
			event.workload || null,
			event.customer || null,
			event.outcome,
			event.happened_at
		);
		// console.log('new_event', new_event);
		redirect(303, `/events?which=${new_event.event}`);
	}
};
