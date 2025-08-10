import { auth } from '$lib/server/api';
import { is_invalid } from '$lib/validation';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	// get cookies from browser
	const auth_token = event.cookies.get('session');

	if (!auth_token) {
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
	const session = await auth.get_session(auth_token);

	// if `user` exists set `events.local`
	if (!is_invalid(session)) {
		event.locals.user = session.user;
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
