/** @type {import('@sveltejs/kit').HandleServerError} */
export async function handleError({ error, status, message }) {
	console.error(status, message, error); //, event, status, message);
	if (error instanceof Error) return { message, stack: error.stack?.split('\n') };
	return { message };
}
