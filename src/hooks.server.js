/** @type {import('@sveltejs/kit').HandleServerError} */
export async function handleError({ error, event, status, message }) {
	console.error(error, event, status, message);
	return { message };
}
