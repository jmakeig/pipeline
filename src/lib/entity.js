import { exists } from './util';

/**
 * @template Entity
 * @typedef {import("./types").Validation<Entity>} Validation
 */
/**
 * @typedef {import("./types").Customer} Customer
 * @typedef {import("./types").CustomerNew} CustomerNew
 * @typedef {import("./types").Region} Region
 * @typedef {import("./types").Segment} Segment
 */

/**
 *
 * @param {CustomerNew} customer
 * @returns {customer is Customer}
 */
function is_valid_customer(customer) {
	return 0 === validate_customer(customer).length;
}

/**
 *
 * @param {CustomerNew} customer
 * @returns {Array<Validation<Customer>>}
 */
export function validate_customer(customer) {
	/** @type {Array<Validation<Customer>>} */
	const validations = [];
	if (!exists(customer.name)) {
		validations.push({ for: 'name', message: 'Missing name.' });
	} else if (customer.name?.length < 2) {
		validations.push({ for: 'name', message: 'Name must be at least two characters.' });
	}
	// This is redundant since the label is calculated server-side
	if (!exists(customer.label)) {
		validations.push({ for: 'label', message: 'Missing label.' });
	} else if (customer.label?.length < 2) {
		validations.push({ for: 'label', message: 'Label must be at least two characters.' });
	}
	// Nullable
	if (null !== customer.region && !is_region(customer.region)) {
		validations.push({
			for: 'region',
			message: `"${String(customer.region)} is not a valid region."`
		});
	}
	// Nullable
	if (null !== customer.segment && !is_segment(customer.segment)) {
		validations.push({
			for: 'segment',
			message: `"${String(customer.segment)} is not a valid segment."`
		});
	}
	return validations;
}

/**
 *
 * @param {unknown} value
 * @returns {value is Region}
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
 * @returns {value is Segment}
 */
function is_segment(value) {
	const segments = ['Select', 'Enterprise', 'Corporate', 'SMB'];
	for (const segment of segments) {
		if (segment === value) return true;
	}
	return false;
}
