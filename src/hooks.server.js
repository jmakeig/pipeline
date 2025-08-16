import { sequence } from '@sveltejs/kit/hooks';
import { auth } from '$lib/server/api';
import { is_invalid } from '$lib/validation';
import { redirect } from '@sveltejs/kit';

export const handle = sequence(auth_handle, protect_handle);

/** @type {import('@sveltejs/kit').Handle} */
async function auth_handle({ event, resolve }) {
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
	console.log('session', session);

	// if `user` exists set `events.local`
	if (session && !is_invalid(session)) {
		event.locals.user = session.user;
	}

	console.log('Resolving with event.locals.user', event.locals.user);
	// load page as normal
	return await resolve(event);
}
/** @type {import('@sveltejs/kit').Handle} */
async function protect_handle({ event, resolve }) {
	console.log('protect_handle', event.locals.user);
	console.log('event.route.id', event.route.id?.split('/'));
	const route = event.route;
	if (null === route || null === route.id) return resolve(event); // When is this true?
	if (route.id.split('/').includes('(protected)')) {
		console.warn('PROTECTED', route.id);
		// TODO: Check roles
		if (event.locals.user) return resolve(event);
		return new Response(null, {
			status: 302,
			headers: { location: '/login' }
		});
	}
	// https://github.com/mustofa-id/sveltekit-auth-hook-example/blob/4609c3870393cec4353ecbf3f6aa77d4832bada2/src/hooks/index.ts
	return resolve(event);
}

/** @type {import('@sveltejs/kit').HandleServerError} */
export async function handleError({ error, status, message }) {
	console.error(status, message, error); //, event, status, message);
	if (error instanceof Error) return { message, stack: error.stack?.split('\n') };
	return { message };
}
