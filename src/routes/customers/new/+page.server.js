import { slug } from '$lib/format';
import { add_customer } from '$lib/server/api';
import { is_invalid } from '$lib/validation';
import { fail } from '@sveltejs/kit';

/**
 * @template {Record<string, unknown> | undefined} T
 * @typedef {import('@sveltejs/kit').ActionFailure<T>} ActionFailure
 */

/**
 * @template In, Out
 * @typedef {import('$lib/types').Result<In, Out>} Result
 */

/**
 * @template Entity
 * @typedef {import('$lib/types').Validation<Entity>} Validation
 */

/**
 * @typedef {import('$lib/types').Customer} Customer
 * @typedef {import('$lib/types').CustomerNew} CustomerNew
 */

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	return {};
}

/**
 *
 * @param {Result<CustomerNew, Customer>} result
 * @returns {Record<string, unknown>| ActionFailure<Record<string, unknown>>}
 */
function handle_validation(result) {
	if (is_invalid(result)) return fail(400, { validations: result.validations, customer: result });
	return { customer: result };
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
	new: async ({ request }) => {
		const form = await request.formData();

		/** @type {CustomerNew} */
		const new_customer = {
			name: /** @type {string | null} */ (form.get('name')),
			label: slug(/** @type {string | null} */ (form.get('name')) ?? ''),
			region: /** @type {string | null} */ (form.get('region')),
			segment: /** @type {string | null} */ (form.get('segment'))
		};

		const result = await add_customer(new_customer);
		if (is_invalid(result))
			return fail(400, { validations: result.validations, customer: result.input });
		return { customer: result };
	}
};
