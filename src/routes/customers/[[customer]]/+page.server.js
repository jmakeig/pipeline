import * as api from '$lib/server/api';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const customers = await api.get_customers(params.customer);
	return { customers };
}
