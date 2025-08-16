import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	redirect(302, '/login');
}

export const actions = {
	default({ cookies }) {
		// eat the cookie
		cookies.set('session', '', {
			path: '/',
			expires: new Date(0)
		});

		// redirect the user
		redirect(302, '/login');
	}
};
