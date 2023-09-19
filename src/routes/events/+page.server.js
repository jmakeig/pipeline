import { error } from '@sveltejs/kit';

import { api } from '$lib/api';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	try {
		return await get_customers_from_database();
	} catch (err) {
		throw error(500, String(err));
	}
}

/** @typedef {import('$lib/entities').Event} Event */
/**
 *
 * @returns {Promise<{events: Event[]}>}
 */
async function get_customers_from_database() {
	return {
		events: await api.list_events()
	};
}
