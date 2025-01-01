/**
 * @template T
 * @param {T | undefined} value
 * @returns {value is NonNullable<T>}
 */
export function exists(value) {
	return undefined !== value && null !== value;
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
 *
 * @param {any} value
 * @returns {string | undefined}
 */
export function s(value) {
	if (!exists(value)) return undefined;
	return String(value);
}

/**
 *
 * @param {any} value
 * @returns {Date | undefined}
 */
export function d(value) {
	if (!exists(value)) return undefined;
	return new Date(Date.parse(String(value)));
}

/**
 *
 * @param {any} value
 * @returns {number | undefined}
 */
export function n(value) {
	if (!exists(value)) return undefined;
	return parseFloat(value);
}
