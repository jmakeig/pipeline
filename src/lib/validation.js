/**
 * @template Entity
 * @typedef {import("./types").Validation<Entity>} Validation
 */

import { exists } from './util';

/**
 * @template Entity
 * @param {Validation<Entity>[]} [validations]
 * @param {string} [name]
 * @returns {Validation<Entity>[] | undefined}
 */
export function by(validations, name) {
	if (undefined === validations) return undefined;
	if (undefined === name) return validations;
	return validations.filter((v) => name === v.for);
}

/**
 * Validations that don’t have a specific name,
 * i.e. that aren’t tied to a field.
 *
 * @template Entity
 * @param {Validation<Entity>[]} [validations]
 * @returns {Validation<Entity>[] | undefined}
 */
export function general(validations) {
	if (undefined === validations) return undefined;
	return validations.filter((v) => undefined === v.for);
}

/**
 * @template Entity
 * @param {Validation<Entity>[]} [validations]
 * @param {string} [name]
 * @returns {Validation<Entity> | undefined}
 */
export function first(validations, name) {
	if (undefined === validations) return undefined;
	const v = by(validations, name);
	if (v) return v[0];
	return undefined;
}
/**
 * Has at least one validation.
 * @template Entity
 * @param {Validation<Entity>[]} [validations]
 * @param {string} [name] Omitted will evaluate all validations, regardless of name
 * @returns {boolean}
 */
export function has(validations, name) {
	return Boolean(first(validations, name));
}

/**
 *
 * @param {FormData} form
 * @returns {string}
 */
function serialize(form) {
	return Array.from(form.entries())
		.map((entry) => entry[0] + ': ' + entry[1])
		.join(',\n');
}

/**
 * `FormData.get()` returns `null` for keys that don’t exist. That makes it difficult to differntiate empty strings from actually missing values.
 * `FormData.get() as string` solves the typing problem for `string` values, but not the missing value problem.
 * This function returns `undefined` for actually missing values and `null` for “empty” values.
 * The latter behavior is togglable using `empty_valid`. `empty_valid = true` will return empty string when `value === ''`.
 *
 * @param {FormDataEntryValue?} value
 * @param {boolean} [empty_valid = false]
 * @returns {string | null | undefined}
 * @throws {TypeError} If `value` is `undefined`
 */
export function s(value, empty_valid = false) {
	if (undefined === value) throw new TypeError('undefined');
	if (null === value) return undefined;
	if (!empty_valid && '' === value) return null;
	return String(value);
}
/**
 * @param {FormDataEntryValue?} value
 * @param {boolean} [empty_valid = false]
 * @returns {number | null | undefined}
 * @throws {TypeError}
 */
export function n(value, empty_valid = false) {
	const n = s(value, empty_valid);
	if (!exists(n)) return n;
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseFloat
	// parseFloat() picks the longest substring starting from the beginning that generates a valid number literal. If it encounters an invalid character, it returns the number represented up to that point, ignoring the invalid character and all characters following it.
	return parseFloat(n);
}
/**
 * @param {FormDataEntryValue?} value
 * @param {boolean} [empty_valid = false]
 * @returns {Date | null | undefined}
 */
export function d(value, empty_valid = false) {
	const d = s(value, empty_valid);
	if (!exists(d)) return d;
	if (d) return new Date(Date.parse(d));
}

/**
 * @template In, Out
 * @typedef {import('$lib/types').Result<In, Out>} Result
 */
/**
 * @template In, Out
 * @typedef {import('$lib/types').InvalidResult<In, Out>} InvalidResult
 */

/**
 * Whether a result contains a validation
 * @template T
 * @param {Result<unknown, T>} result
 * @returns {result is InvalidResult<unknown, T>}
 */
export function is_invalid(result) {
	// This is such a hack. (Is `new Object()` a performance issue too?)
	return 'validations' in /** @type {InvalidResult<unknown, T>} */ (new Object(result)); // Can’t use `in` on primitives
}
