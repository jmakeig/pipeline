/** @type {import('./$types').LayoutServerLoad} */
export const load = async ({ locals, request }) => {
	return {
		user: locals.user,
		q: URL.parse(request.url)?.searchParams.get('q')
	};
};
