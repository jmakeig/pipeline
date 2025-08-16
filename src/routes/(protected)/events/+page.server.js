import * as api from '$lib/server/api';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const events = await api.get_events(params.customer, params.workload);
	return { events };
}
