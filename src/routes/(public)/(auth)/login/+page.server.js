import { auth } from '$lib/server/api';
import { is_invalid } from '$lib/validation';
import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ request, locals }) => {
	// redirect user if logged in
	if (locals.user) {
		redirect(302, '/');
	}

	return {
		to: URL.parse(request.url)?.searchParams.get('to')
	};
};

export const actions = {
	async login({ cookies, request, url }) {
		const data = await request.formData();
		const user_name = data.get('user_name');
		const password = data.get('password');
		const to = String(data.get('to'));

		if (typeof user_name !== 'string' || typeof password !== 'string' || !user_name || !password) {
			return fail(400, { login: { user_name }, validations: [{ message: 'I don’t think so!' }] });
		}

		const user = await auth.get_user(user_name);

		if (user && !is_invalid(user)) {
			const password_match = await bcrypt.compare(password, user.password_hash);
			// console.warn('password_match', user.password_hash, password_match);
			if (!password_match) {
				return fail(400, { login: { user_name }, validations: [{ message: 'I don’t think so!' }] });
			}

			const session = await auth.create_session(user.user_name);
			if (!is_invalid(session)) {
				cookies.set('session', session.auth_token, {
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
				console.log('url', url);
				redirect(302, to ?? '/');
			} else {
				return fail(401, { validations: session.validations });
			}
		} else {
			return fail(400, { validations: user?.validations });
		}
	}
};
