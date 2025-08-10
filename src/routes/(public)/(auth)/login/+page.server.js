import { auth } from '$lib/server/api';
import { is_invalid } from '$lib/validation';
import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals }) => {
	// redirect user if logged in
	if (locals.user) {
		redirect(302, '/');
	}
};

export const actions = {
	login: async ({ cookies, request }) => {
		console.log('login');

		const data = await request.formData();
		const username = data.get('user_name');
		const password = data.get('password');

		if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) {
			return fail(400, { invalid: true }); // TODO: Validations
		}

		// EX:  const user = await db.user.findUnique({ where: { username } });
		// TMP: const user = await Promise.resolve({ user_name: 'adsf', first_name: 'As', last_name: 'Df' });
		const user = await auth.get_user(username);

		if (!user) {
			return fail(400, { credentials: true }); // TODO: Validations
		}

		// TODO
		//const userPassword = await bcrypt.compare(password, user.password_hash);
		const password_match = true;

		if (!password_match) {
			return fail(400, { credentials: true });
		}

		// generate new auth token just in case
		/*
		const authenticatedUser = await db.user.update({
			where: { username: user.username },
			data: { userAuthToken: crypto.randomUUID() }
		});
		*/
		if (!is_invalid(user)) {
			cookies.set('session', user.auth_token, {
				// send cookie for every page
				path: '/',
				// server side only cookie so you can't use `document.cookie`
				httpOnly: true,
				// only requests from same site can send cookies
				// https://developer.mozilla.org/en-US/docs/Glossary/CSRF
				sameSite: 'strict',
				// only sent over HTTPS in production
				secure: process.env.NODE_ENV === 'production',
				// set cookie to expire after a month
				maxAge: 60 * 60 * 24 * 30
			});

			// redirect the user
			redirect(302, '/');
		} else {
			return fail(400, { validations: user.validations });
		}
	}
};
