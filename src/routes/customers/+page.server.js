import { error } from '@sveltejs/kit';
import * as api from '$lib/server/api';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	try {
		//const customers = Promise.resolve([{ name: 'Acme' }, { name: 'Beta' }]);
		const workloads = api.get_workloads();
		return { workloads };
	} catch (err) {
		error(500, 'Yikes!');
	}
}
