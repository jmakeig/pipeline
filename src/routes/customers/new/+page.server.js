import { slug } from '$lib/format';
import { add_customer, ValidationError } from '$lib/server/api';
import { exists } from '$lib/util';
import { has, s } from '$lib/validation';
import { fail } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	return {};
}
/**
 *
 * @param {unknown} value
 * @returns {value is import('$lib/types').Region}
 */
function is_region(value) {
	const regions = ['NORTHAM', 'EMEA', 'JAPAC', 'LATAM'];
	for (const region of regions) {
		if (region === value) return true;
	}
	return false;
}

/**
 *
 * @param {unknown} value
 * @returns {value is import('$lib/types').Segment}
 */
function is_segment(value) {
	const segments = ['Select', 'Enterprise', 'Corporate', 'SMB'];
	for (const segment of segments) {
		if (segment === value) return true;
	}
	return false;
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
	new: async ({ request }) => {
		const form = await request.formData();
		console.log('?/new', form);

		/** @type {import('$lib/types').Validation[]} */
		const validations = [];

		const name = s(form.get('name'));
		// const label = s(form.get('label'));
		const label = slug(name ?? '');
		const region = s(form.get('region'));
		const segment = s(form.get('segment'));

		if (!exists(name)) {
			validations.push({ for: 'name', message: 'Missing name.' });
		} else if (name?.length < 2) {
			validations.push({ for: 'name', message: 'Name must be at least two characters.' });
		}
		// This is redundant since the label is calculated server-side
		if (!exists(label)) {
			validations.push({ for: 'label', message: 'Missing label.' });
		} else if (label?.length < 2) {
			validations.push({ for: 'label', message: 'Label must be at least two characters.' });
		}
		// Nullable
		if (null !== region && !is_region(region)) {
			validations.push({ for: 'region', message: `"${String(region)} is not a valid region."` });
		}
		// Nullable
		if (null !== segment && !is_segment(segment)) {
			validations.push({ for: 'segment', message: `"${String(segment)} is not a valid segment."` });
		}

		/** @type {import('$lib/types').CustomerNew} */
		const new_customer = {
			name,
			label,
			region: is_region(region) ? region : null, // Oof
			segment: is_segment(segment) ? segment : null // Oof
		};

		if (has(validations)) {
			return fail(400, {
				validations,
				customer: new_customer
			});
		}

		try {
			const customer = await add_customer(new_customer);
			return { customer };
		} catch (error) {
			if (error instanceof ValidationError) {
				validations.push({
					for: 'name',
					message: `${new_customer.name} already exists. Names and labels (${slug(new_customer.name ?? '')}) must be unique.`
				});
				return fail(400, { validations, customer: new_customer });
			}
			throw error;
		}
	}
};
