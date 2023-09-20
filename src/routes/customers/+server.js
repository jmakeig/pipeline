import { json } from '@sveltejs/kit';
import { api } from '$lib/api';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	return json(await api.find_customers(url.searchParams.get('by') || ''));
}
