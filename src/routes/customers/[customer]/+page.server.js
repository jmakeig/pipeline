import { get_customer } from '$lib/server/api';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const customer = await get_customer(params.customer);
	if (!customer) error(404, `Customer '${params.customer}' does not exist`);
	return { customer };
}
