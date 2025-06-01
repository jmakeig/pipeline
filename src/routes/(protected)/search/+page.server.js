import { search } from '$lib/server/api';

/** @type {import('./$types').PageServerLoad} */
export async function load({ request }) {
	const url = URL.parse(request.url);
	if (!url) throw new Error();
	const q = url.searchParams.get('q');
	return {
		q,
		results: await search(q)
	};
}
