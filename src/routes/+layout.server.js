/** @type {import('./$types').LayoutServerLoad} */
export const load = async ({ locals }) => {
	console.log('layout load', locals.user);
	return {
		user: locals.user
	};
};
