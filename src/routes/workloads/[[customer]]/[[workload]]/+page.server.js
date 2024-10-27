import * as api from '$lib/server/api';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const workloads = await api.get_workloads(params.customer, params.workload);
	return { workloads };
}
