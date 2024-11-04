import { add_workload, get_customer, ValidationError } from '$lib/server/api';
import { error, fail, redirect } from '@sveltejs/kit';

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
		const values = {
			customer: form.get('customer'),
			name: form.get('name'),
			label: form.get('label'),
			stage: form.get('stage')
		};
		let workload;
		try {
			workload = await add_workload(values);
		} catch (err) {
			if (err instanceof ValidationError) {
				return fail(err.code || 400, {
					validations: err.validations,
					data: { workload: values }
				});
			}
			throw err;
		}
		redirect(303, `/workloads`); // Go back to /customers/[customer]
	}
};
