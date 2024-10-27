import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	try {
		const customers = Promise.resolve([{ name: 'Acme' }, { name: 'Beta' }]);
		return { customers };
	} catch (err) {
		error(500, 'Not found');
	}
}
