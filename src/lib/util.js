/**
 * @template T
 * @param {T | undefined} value
 * @returns {value is NonNullable<T>}
 */
export function exists(value) {
	return undefined !== value && null !== value;
}

/**
 * @param {unknown} value
 * @returns {value is undefined}
 */
export function missing(value) {
	return undefined === value;
}
