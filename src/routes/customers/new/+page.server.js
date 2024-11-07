import { add_customer, add_workload, get_customer, ValidationError } from '$lib/server/api';
import { error, fail, redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	return {};
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
	default: async ({ request }) => {
		const form = await request.formData();

		/**
		 * @type {import('$lib/types').CustomerNew}
		 */
		const values = {
			name: /** @type {string} */ (form.get('name')),
			label: /** @type {string} */ (form.get('label')),
			region: /** @type {import('$lib/types').Customer['region']} */ (form.get('region')),
			segment: /** @type {import('$lib/types').Customer['segment']} */ (form.get('segment'))
		};
		let customer;
		try {
			customer = await add_customer(values);
		} catch (err) {
			if (err instanceof ValidationError) {
				return fail(err.code || 400, {
					validations: err.validations,
					data: { customer: values }
				});
			}
			throw err;
		}
		redirect(303, `/customers`);
	}
};
