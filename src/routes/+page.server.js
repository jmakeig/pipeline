import * as api from '$lib/server/api';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const follow_ups = await api.get_workload_urgency();
	return { follow_ups };
}
