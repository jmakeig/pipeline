/** @type {import('./$types').LayoutServerLoad} */
export const load = async ({ locals, request }) => {
	console.log('Top-level layout load', locals.user ?? '(no locals.user defined)');
	return {
		user: locals.user,
		q: URL.parse(request.url)?.searchParams.get('q')
	};
};
