/** @type {import('@sveltejs/kit').HandleClientError} */
export async function handleError({ error, event, status, message }) {
	console.error(error, event, status, message);
	return {
		message
	};
}
