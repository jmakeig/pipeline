/**
 * First value that is not `undefined` and not `null`. Zero is _not_ falsey.
 * @param  {...any} values
 * @returns {unknown | undefined}
 */
export function coalesce(...values) {
	for (const v of values) {
		if (undefined !== v && null !== v) return v;
	}
	return undefined;
}

/**
 * @param {Date} [value]
 * @param {string} [fallback]
 * @returns {string}
 */
export function date(value, fallback = '') {
	if (!value) return fallback;
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

/**
 * A localized human-friendly description of relative time, e.g. “10 minutes ago”. Supports ranges of seconds through years.
 *
 * @param {Date | string | null} date A proper `Date` object or an ISO string, such as serialzed from the data layer, which also might be `null`
 * @param {string} [fallback] What to return if `date` is false-y
 * @returns {string | undefined} The localized text or `null` if `null` was passed in
 */
export function ago(date, fallback) {
	if (!date) return fallback;
	if ('string' === typeof date) date = new Date(date);
	const diff = Math.round((date.valueOf() - Date.now()) / 1000);
	const bounds = [60, 3600, 86400, 86400 * 7, 86400 * 30, 86400 * 365, Infinity];
	const units = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'];
	const index = bounds.findIndex((cutoff) => cutoff > Math.abs(diff));
	const divisor = index ? bounds[index - 1] : 1;
	const format = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
	// @ts-ignore
	return format.format(Math.floor(diff / divisor), units[index]);
}

/**
 * Turns a string into a URL-ready slug
 *
 * @param {string} name
 * @returns {string}
 */
export function slug(name) {
	const maxLength = 80;
	let len = 0,
		index = 0,
		slug = '';
	// https://stackoverflow.com/a/66721429
	const tokens = name.split(/[^\p{L}\p{N}]+/gu);
	while (len < maxLength && index < tokens.length) {
		len += tokens[index].length;
		if (tokens[index].length > 0) {
			slug += (index > 0 ? '-' : '') + tokens[index++].toLowerCase();
		} else {
			index++;
		}
	}
	return slug;
}

/**
 *
 * @param {number?} [value]
 * @param {any} [options={}]
 * @returns {string | undefined}
 */
export function currency(
	value,
	{
		round,
		min = -Infinity,
		max = Infinity,
		notation = 'standard',
		style,
		minimumFractionDigits,
		maximumFractionDigits
	} = {}
) {
	if (undefined === value || null === value) return undefined;
	if (value < min) return `< ${currency(min)}`;
	if (value > max) return `> ${currency(max)}`;
	// @ts-ignore
	const format = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		currencyDisplay: 'narrowSymbol',
		notation: notation,
		compactDisplay: 'short',
		minimumFractionDigits: coalesce(minimumFractionDigits, round),
		maximumFractionDigits: coalesce(maximumFractionDigits, round)
	}).format;
	if ('thousands' === style) {
		return thousands(value, format);
	}
	return format(value);
}

/**
 *
 * @param {number} [value]
 * @param {any} [options={}]
 * @returns {string | undefined}
 */
export function num(
	value,
	{ round, style = 'decimal', minimumFractionDigits, maximumFractionDigits } = {}
) {
	if (undefined === value) return value;
	const format = new Intl.NumberFormat('en-US', {
		style: style,
		minimumFractionDigits: minimumFractionDigits || round,
		maximumFractionDigits: maximumFractionDigits || round
	}).format;
	return format(value);
}

/**
 * Formats into groups of thousands with a maxium of three digits,
 * plus a decimal and a sign, depending on the value.
 *
 * @param { number } [value]
 * @param {(v: number) => string} [format=(v) => String(v)]
 * @returns {string | undefined}
 */
function thousands(value, format = (v) => String(v)) {
	if (undefined === value) return undefined;

	const sign = value < 0 ? -1 : 1;
	const groups = ['', 'K', 'M', 'B', 'T'];
	const abs = Math.abs(value);
	let g = Math.trunc(Math.log10(abs) / 3);
	const left = abs * Math.pow(10, -Math.min(4, g) * 3);
	const pow = Math.trunc(Math.log10(left)) - 2;
	let round = Math.round(left * Math.pow(10, -pow)) * Math.pow(10, pow);

	// Ugly, but effective
	if (round === 1000) {
		round = 1;
		g++;
	}

	// const format = new Intl.NumberFormat('en-US').format;

	// return round + " " + String(left) + groups[g];
	return format(round * sign) + groups[g];
}
