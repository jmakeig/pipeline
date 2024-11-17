import { ConstraintViolation, create_connection, optional_default, prune_optional } from './db';

export class ValidationError extends Error {
	/**
	 *
	 * @param {import('$lib/types').Validation[]} [validations=[]]
	 * @param {Error} [original]
	 * @param {number} [code=400]
	 */
	constructor(validations = [], code = 400, original) {
		super();
		this.code = code;
		this.name = 'ValidationError';
		this.original = original;
		this.validations = validations;
	}
}

const db = create_connection();

/**
 * @typedef {import('$lib/types').Customer} Customer
 * @param {Customer['label']} [customer] Customer label
 * @returns {Promise<Array<Customer>>}
 */
export async function get_customers(customer) {
	const sql = `SELECT
			c.customer, c.label, c.name
		FROM customers AS c
		WHERE TRUE
			AND ($1::text IS NULL OR c.label = $1)
		LIMIT 100 /* TODO: Need pagination */`;
	const results = await db.readonly(sql, [customer]);
	return results.rows;
}

/**
 * @typedef {import('$lib/types').CustomerDeep} CustomerExt
 * @param {CustomerExt['label']} label
 * @returns {Promise<CustomerExt>}
 */
export async function get_customer(label) {
	// Assumes w alias for workloads and s alias for sales_stages
	const workload_obj = `
		JSON_BUILD_OBJECT(
			'workload', w.workload,
			'label', w.label,
			'name', w.name,
			'stage', CASE WHEN w.stage IS NULL THEN NULL ELSE JSON_BUILD_OBJECT('stage', s.stage, 'name', s.name) END,
			'last_touched', last_touched
		)`;
	const sql = `
	WITH
		-- TODO: This should be a view
		-- workloads plus the most recent related event date
		_workloads_ext AS (
			SELECT
				_w.*,
				_e.last_touched
			FROM workloads AS _w
			LEFT JOIN (
				SELECT
					workload,
					MAX(happened_at) AS last_touched
				FROM events
				GROUP BY workload
			) AS _e USING(workload)
		),
		-- workloads keyed by customer, aggregated into a JSON array of JSON objects
		_workloads_obj AS (
			SELECT
				w.customer,
				JSON_AGG(${workload_obj}) AS workloads
			FROM _workloads_ext AS w
			LEFT JOIN sales_stages AS s USING(stage)
			GROUP BY w.customer
		),
		-- events keyed by customer aggregated as a JSON array of JSON objects
		_events_obj AS (
			SELECT
				customer,
				JSON_AGG(
					JSON_BUILD_OBJECT(
						'event', event,
						'workload', workload,
						'outcome', outcome,
						'happened_at', happened_at
					)
				) AS events
			FROM (
				(
					-- Joins on workload
					SELECT
						c.customer,
						${workload_obj} AS workload,
						e.event,
						e.outcome,
						e.happened_at
					FROM events AS e
					INNER JOIN _workloads_ext AS w ON e.workload = w.workload
					INNER JOIN customers AS c ON w.customer = c.customer
					INNER JOIN sales_stages AS s ON w.stage = s.stage
				) UNION ALL (
					-- Joins on customer
					SELECT
						c.customer,
						NULL AS workload,
						e.event,
						e.outcome,
						e.happened_at
					FROM events AS e
					INNER JOIN customers AS c USING(customer)
				)
				ORDER BY
					happened_at DESC
			)
			GROUP BY
				customer
		)
		SELECT
			c.customer,
			c.label,
			c.name,
			c.region,
			c.segment,
			w.workloads,
			e.events
		FROM customers AS c
		LEFT JOIN _workloads_obj AS w USING(customer)
		LEFT JOIN _events_obj AS e USING(customer)
		WHERE c.label = $1`;
	// TODO: Count workloads and events, last touch
	const result = await db.readonly(sql, [label]);
	return result.rows[0];
}

/**
 * @param {string} [customer] Customer label
 * @param {string} [workload] Workload label
 * @returns
 */
export async function get_workloads(customer, workload) {
	const sql = `SELECT
			w.workload,
			w.label,
			w.name,
			w.customer,
			c.label AS customer_label,
			c.name AS customer_name,
			c2.last_happened_at,
			c2.events_count
		FROM workloads AS w
		INNER JOIN customers AS c USING(customer)
		LEFT JOIN (
			SELECT
				e.workload,
				MAX(e.happened_at) AS last_happened_at,
				COUNT(e.happened_at) AS events_count
			FROM events AS e
			WHERE e.workload IS NOT NULL
			GROUP BY e.workload
		) AS c2 USING(workload)
		WHERE TRUE
			AND ($1::text IS NULL OR c.label = $1)
			AND ($2::text IS NULL OR w.label = $2)
		LIMIT 100 /* TODO: Need pagination */
		`;
	// console.log('get_workloads', sql, [...arguments]);
	const results = await db.readonly(sql, [customer, workload]);
	return results.rows;
}
//import('$lib/types').Customer
/**
 *
 * @param {import('$lib/types').CustomerNew} customer
 * @returns {Promise<import('$lib/types').Customer>}
 */
export async function add_customer({ name, label, region, segment }) {
	const sql = `
		INSERT INTO customers(name, label, region, segment)
		VALUES ($1, $2, $3, $4)
		RETURNING customer, name, label, region, segment`;
	let results;
	try {
		results = await db.query(sql, [name, label, region || null, segment || null]);
	} catch (err) {
		if (err instanceof ConstraintViolation) {
			throw new ValidationError(
				[{ for: 'name', message: `Customer “${name}” (${label}) already exists.` }],
				409,
				err
			);
		}
		throw err;
	}
	return results.rows[0];
}

/**
 * @typedef {import('$lib/types').Workload} Workload
 * @typedef {import('$lib/types').WorkloadNew} WorkloadNew
 * @param {WorkloadNew} workload
 * @returns {Promise<Workload>}
 */
export async function add_workload({ customer, name, label, stage }) {
	const sql = `
		INSERT INTO workloads(customer, name, label, stage)
		VALUES ($1, $2, $3, $4)
		RETURNING workload, customer, name, label, stage`;
	let results;
	try {
		results = await db.query(sql, [customer, name, label, stage || null]);
	} catch (err) {
		if (err instanceof ConstraintViolation) {
			throw new ValidationError(
				[{ for: 'name', message: `Workload “${name}” (${label}) already exists.` }],
				409,
				err
			);
		}
		throw err;
	}
	return results.rows[0];
}

/**
 *
 * @param {string} [customer] Customer label
 * @param {string} [workload] Workload label
 * @returns
 */
export async function get_events(customer, workload) {
	const sql = `(
			-- Join on workload, ignore NULL customer
			SELECT
				e.event,
				c.label AS customer_label,
				c.name AS customer_name,
				w.label AS workload_label,
				w.name AS workload_name,
				e.outcome,
				e.happened_at
			FROM events AS e
			INNER JOIN workloads AS w ON e.workload = w.workload
			INNER JOIN customers AS c ON w.customer = c.customer
			WHERE TRUE
				AND ($1::text IS NULL OR c.label = $1)
				AND ($2::text IS NULL OR w.label = $2)
		) UNION ALL (
			-- Join on customer, given NULL workload
			SELECT
				e.event,
				c.label AS customer_label,
				c.name AS customer_name,
				NULL AS workload_label,
				NULL AS workload_name,
				e.outcome,
				e.happened_at
			FROM events AS e
			INNER JOIN customers AS c ON e.customer = c.customer
			WHERE TRUE
				AND ($1::text IS NULL OR c.label = $1)
		)
		ORDER BY happened_at DESC
		LIMIT 100 /* TODO: Need pagination */
		`;
	const results = await db.readonly(sql, [customer, workload]);
	return results.rows;
}

/**
 *
 * @param {string | null} workload
 * @param {string | null} customer
 * @param {string} outcome
 * @param {Date} [happened_at]
 * @returns {Promise<any>}
 */
export async function add_event(workload, customer, outcome, happened_at) {
	const sql = `
		INSERT INTO events(workload, customer, outcome, happened_at)
		VALUES ($1, $2, $3, ${optional_default(happened_at, 4)})
		RETURNING event, workload, customer, outcome, happened_at --NO PARENS!
	`;
	// console.log(sql, [workload, customer, outcome, happened_at]);
	const results = await db.query(sql, prune_optional([workload, customer, outcome, happened_at]));
	return results.rows[0];
}

/**
 *
 * @param {string} [customer]
 * @returns
 */
export async function get_customer_workloads(customer) {
	const sql = `
	(
		SELECT
			w.workload,
			w.label AS workload_label,
			w.name AS workload_name,
			c.customer,
			c.label AS customer_label,
			c.name AS customer_name
		FROM workloads AS w
		INNER JOIN customers AS c USING(customer)
	) UNION ALL (
		SELECT
			NULL AS workload,
			NULL AS workload_label,
			NULL AS workload_name,
			c.customer,
			c.label AS customer_label,
			c.name AS customer_name
		FROM customers AS c
	)
	ORDER BY
		workload_name ASC,
		customer_name ASC`;
	const results = await db.readonly(sql);
	return results.rows;
}

/**
 * Active workloads order by descending “urgency”, where urgency is
 * a function of size, age, stage, and customer segment.
 *
 * @returns {Promise<any>}
 */
export async function get_workload_urgency() {
	const sql = `
		WITH follow_ups AS (
			SELECT
				JSON_BUILD_OBJECT(
					'workload', JSON_BUILD_OBJECT(
							'workload', w.workload,
							'name', w.name,
							'label', w.label,
							'customer', ROW_TO_JSON(c),
							'stage', ROW_TO_JSON(s),
							'size', w.size,
							'last_touched', e.last_touched,
							'event_count', e.event_count
					),
					'urgency', 0
						-- Stage
						+ CASE WHEN w.stage BETWEEN 2 AND 3 THEN 250
								WHEN w.stage IS NULL THEN 100
								WHEN w.stage = 4 THEN 100
								WHEN w.stage = 1 THEN 50
								WHEN w.stage = 98 THEN -10
								ELSE -100
							END
						-- Segment
						+ CASE WHEN 'Select' = c.segment THEN 100
							WHEN 'Enterprise' = c.segment THEN 50
							WHEN 'Corporate' = c.segment THEN 10
							ELSE -10
						END
						-- Opportunity size
						+ (COALESCE(w.size, 0.0) / 10^5)::int
						-- Age
						+ (COALESCE(DATE_PART('days', now() - e.last_touched), 0) * 1.2)::int
				) AS follow_up
			FROM workloads AS w
			INNER JOIN customers AS c ON w.customer = c.customer
			LEFT JOIN (
				SELECT
					workload,
					COUNT(event) AS event_count,
					MAX(happened_at) AS last_touched
				FROM events GROUP BY workload
			) AS e ON w.workload = e.workload
			LEFT JOIN sales_stages AS s ON w.stage = s.stage
		)
		-- Using a CTE so I don’t have to repeat the urgency
		-- logic in the sort expression
		SELECT follow_up
		FROM follow_ups
		ORDER BY
			(follow_up ->> 'urgency')::int DESC`;
	const results = await db.readonly(sql);
	// TODO: This is weird. Why does it add an extra layer?
	return results.rows.map((r) => r.follow_up);
}

/**
 *
 * @returns {Promise<any>}
 */
export async function get_stages_summary() {
	const sql = `
		SELECT
			s.stage,
			s.name,
			JSON_BUILD_OBJECT(
				'count', COUNT(w),
				'size', SUM(w.size)
			) AS workloads
		FROM sales_stages AS s
		LEFT JOIN workloads AS w ON s.stage = w.stage
		WHERE s.stage < 5
		GROUP BY s.stage
		ORDER BY s.stage ASC`;
	const results = await db.readonly(sql);
	return results.rows;
}

/**
 *
 * @returns {Promise<number?>}
 */
export async function get_pipeline_size() {
	const sql = `
		SELECT
			SUM(w.size) AS size
		FROM workloads AS w
		WHERE w.stage < 5`;
	const results = await db.readonly(sql);
	if (results.rowCount) return results.rows[0].size;
	return null;
}
