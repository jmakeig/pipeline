import { error } from '@sveltejs/kit';

import { get_customers } from '$lib/api';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	try {
		return await get_customers_from_database();
	} catch (err) {
		throw error(500, String(err));
	}
}

async function get_customers_from_database() {
	return {
		customers: await get_customers()
	};
}