import * as api from '$lib/server/api';
import { fail } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const follow_ups = await api.get_workload_urgency();
	const stages = await api.get_stages_summary();
	const size = await api.get_pipeline_size();
	const customer_workloads = await api.get_customer_workloads();

	return { follow_ups, stages, size, customer_workloads };
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
	quick_add: async ({ request }) => {
		console.log('quick_add');
		const form = await request.formData();
		return fail(400, {
			/** @type {import("$lib/types").Validation<{customer_workload: any}>[]} */
			validations: [{ for: 'customer_workload', message: 'Noooooo!' }],
			data: null
		});
	}
};
