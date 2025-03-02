/** @type {import('./$types').PageLoad} */
export async function load({ url }) {
	const q = url.searchParams.get('q');
	return { q };
}
