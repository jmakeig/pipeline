/** @type {import('@sveltejs/kit').HandleServerError} */
export async function handleError({ error, event, status, message }) {
	console.error(error);
	if (error instanceof Error) {
		return {
			message: error.message,
			line: error.line,
			code: error.code
		};
	}
}
