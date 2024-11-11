import * as api from '$lib/server/api';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	/** @type {Array<{workload: import('$lib/types').Workload, urgency: number}>} */
	const follow_ups = await api.get_workload_urgency();
	/** @type {Array<{stage: number, name: string, workloads: {count: number, size: number?}}>} */
	const stages = await api.get_stages_summary();
	return { follow_ups, stages };
}
