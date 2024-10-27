import * as api from '$lib/server/api';

/** @type {import('../$types').PageServerLoad} */
export async function load() {
	const workloads = await api.get_workloads();
	return { workloads };
}
