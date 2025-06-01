/** @type {import('./$types').LayoutLoad} */
export async function load({ data, url }) {
	const _url = URL.parse(url);
	if (!_url) throw new Error();
	const q = _url.searchParams.get('q');
	return {
		q,
		user: data.user // data is the output from the server load() function
	};
}
