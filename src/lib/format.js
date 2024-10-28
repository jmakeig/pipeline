/**
 * @param {Date | undefined} value
 * @returns {string}
 */
export function format_date(value) {
	if (!value) return '';
	// TODO: i18n
	// https://stackoverflow.com/questions/25050034/get-iso-8601-using-intl-datetimeformat
	return new Intl.DateTimeFormat('en-US').format(value);
}

/**
 *
 * @param {number | undefined} value
 * @returns {string}
 */
export function format_number(value) {
	if (undefined === value) return '';
	if (null === value) return '';
	return String(value);
}

const plural_rules = new Intl.PluralRules('en-US');
/**
 *
 * @param {number} count
 * @param {string} singular
 * @param {string} plural
 * @returns {string}
 */
export function pluralize(count, singular, plural) {
	const grammatical_number = plural_rules.select(count);
	switch (grammatical_number) {
		case 'one':
			return `${format_number(count)} ${singular}`;
		case 'other':
			return `${format_number(count)} ${plural}`;
		default:
			throw new Error('Unknown: ' + grammatical_number);
	}
}
