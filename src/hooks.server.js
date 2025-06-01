/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	// get cookies from browser
	const session = event.cookies.get('session');

	if (!session) {
		console.warn('No session');
		// if there is no session load page as normal
		return await resolve(event);
	}

	// find the user based on the session
	/*
	const user = await db.user.findUnique({
		where: { userAuthToken: session },
		select: { username: true, role: true },
	})
	*/
	const user = await Promise.resolve({
		user_name: 'asdf',
		first_name: 'As',
		last_name: 'Df'
	});

	// if `user` exists set `events.local`
	if (user) {
		event.locals.user = {
			user_name: user.user_name
			// role: user.role.name,
		};
	}

	console.log('Resolving with event.locals.user', event.locals.user);
	// load page as normal
	return await resolve(event);
}

/** @type {import('@sveltejs/kit').HandleServerError} */
export async function handleError({ error, status, message }) {
	console.error(status, message, error); //, event, status, message);
	if (error instanceof Error) return { message, stack: error.stack?.split('\n') };
	return { message };
}
