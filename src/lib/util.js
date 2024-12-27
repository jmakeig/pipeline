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
