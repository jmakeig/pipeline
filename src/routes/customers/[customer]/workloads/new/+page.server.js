import { add_workload, get_customer } from '$lib/server/api';
import { error, redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const customer = await get_customer(params.customer);
	if (!customer) error(404, `Customer '${params.customer}' does not exist`);
	return { customer };
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		const new_workload = {
			customer: form.get('customer'),
			name: form.get('name'),
			label: form.get('label'),
			stage: form.get('stage')
		};
		const workload = await add_workload(new_workload);
		redirect(303, `/workloads`);
	}
};
