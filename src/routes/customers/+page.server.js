import { error } from '@sveltejs/kit';
import * as api from '$lib/server/api';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	// try {
		const workloads = await api.get_workloads();
		return { workloads };
	// } catch (err) {
	// 	error(500, 'Yikes!');
	// }
}
