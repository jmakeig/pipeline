/** @typedef {import("./types").Validation} Validation */

/**
 *
 * @param {Validation[]} [validations]
 * @param {string} [name]
 * @returns {Validation[] | undefined}
 */
export function by(validations, name) {
	if (undefined === validations) return undefined;
	return validations.filter((v) => name === v.for);
}

/**
 * Validations that don’t have a specific name,
 * i.e. that aren’t tied to a field.
 *
 * @param {Validation[]} [validations]
 * @returns {Validation[] | undefined}
 */
export function general(validations) {
	if (undefined === validations) return undefined;
	return validations.filter((v) => undefined === v.for);
}

/**
 *
 * @param {Validation[]} [validations]
 * @param {string} [name]
 * @returns {Validation | undefined}
 */
export function first(validations, name) {
	if (undefined === validations) return undefined;
	const v = by(validations, name);
	if (v) return v[0];
	return undefined;
}
/**
 *
 * @param {Validation[]} [validations]
 * @param {string} [name]
 * @returns {boolean}
 */
export function has(validations, name) {
	return Boolean(first(validations, name));
}
