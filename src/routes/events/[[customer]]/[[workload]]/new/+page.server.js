import { get_customer_workloads } from '$lib/server/api';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const customer_workloads = await get_customer_workloads();
	return { customer_workloads };
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		// TODO
		return {};
	}
};
