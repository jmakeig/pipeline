/** @type {import('./$types').LayoutServerLoad} */
export const load = async ({ locals, request }) => {
	console.log('layout load', locals.user);
	return {
		user: locals.user,
		q: URL.parse(request.url)?.searchParams.get('q')
	};
};
