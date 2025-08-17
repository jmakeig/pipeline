import { get_workload } from '$lib/server/api';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	return { workload: await get_workload(params.customer, params.workload) };
}
