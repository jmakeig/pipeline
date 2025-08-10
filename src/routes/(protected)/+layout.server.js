/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals }) {
	console.log('(protected) layout server locals', locals);
	return {};
}
