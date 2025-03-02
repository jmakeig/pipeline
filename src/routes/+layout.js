/** @type {import('./$types').LayoutLoad} */
export async function load({ url }) {
	const _url = URL.parse(url);
	if (!_url) throw new Error();
	const q = _url.searchParams.get('q');
	return {
		q
	};
}
