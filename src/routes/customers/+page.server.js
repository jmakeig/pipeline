import { get_customers } from '$lib/server/api';
import { exists, s } from '$lib/util';
import { has } from '$lib/validation';
import { fail } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const customers = await get_customers();
	return { customers };
}
