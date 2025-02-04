import { get_customer } from '$lib/server/api';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const label = params.customer;
	const customer = await get_customer(label);
	if (null === customer) {
		error(404, {
			message: 'Not found'
		});
	}

	return { customer };
}
