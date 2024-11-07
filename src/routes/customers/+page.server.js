import { get_customers } from '$lib/server/api';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const customers = await get_customers();
	return { customers };
}
