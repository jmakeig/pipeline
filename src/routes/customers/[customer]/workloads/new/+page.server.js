import { add_workload, get_customer, ValidationError } from '$lib/server/api';
import { error, fail, redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const customer = await get_customer(params.customer);
	if (!customer) error(404, `Customer '${params.customer}' does not exist`);
	return { customer };
}

/** @typedef {import('$lib/types').WorkloadNew} WorkloadNew */

/** @satisfies {import('./$types').Actions} */
export const actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		/** @type {WorkloadNew} */
		const values = {
			customer: /** @type {WorkloadNew['customer']}*/ (form.get('customer')),
			name: /** @type {WorkloadNew['name']}*/ (form.get('name')),
			label: /** @type {WorkloadNew['label']}*/ (form.get('label')),
			stage: /** @type {WorkloadNew['stage']}*/ (form.get('stage'))
		};
		try {
			await add_workload(values);
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
