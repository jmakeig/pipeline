// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			message: string;
			stack?: string[];
		}
		interface Locals {
			user: {
				user_name: string;
				first_name?: string;
				last_name?: string;
			}
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
