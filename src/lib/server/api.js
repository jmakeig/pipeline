import { create_connection, optional_default, prune_optional } from './db';

const db = create_connection();

/**
 *
 * @param {string} [customer] Customer label
 * @returns
 */
export async function get_customers(customer) {
	const sql = `SELECT
			c.customer, c.label, c.name
		FROM customers AS c
		WHERE TRUE
			AND ($1::text IS NULL OR c.label = $1)
		LIMIT 100 /* TODO: Need pagination */`;
	const results = await db.query(sql, [customer]);
	return results.rows;
}

/**
 *
 * @param {string} label
 * @returns {Promise<any>}
 */
export async function get_customer(label) {
	// Assumes w alias for workloads and s alias for sales_stages
	const workload_obj = `
		JSON_BUILD_OBJECT(
			'workload', w.workload,
			'label', w.label,
			'name', w.name,
			'stage', JSON_BUILD_OBJECT('stage', w.stage, 'name', s.name)
		)`;
	const sql = `
		WITH _workloads AS (
			SELECT
				w.customer,
				JSON_AGG(${workload_obj}) AS workloads
			FROM workloads AS w
			INNER JOIN sales_stages AS s USING(stage)
			GROUP BY w.customer
		),
		_events AS (
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
					INNER JOIN workloads AS w ON e.workload = w.workload
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
			c.name,
			w.workloads,
			e.events
		FROM customers AS c
		INNER JOIN _workloads AS w USING(customer)
		INNER JOIN _events AS e USING(customer)
		WHERE TRUE
			AND c.label = $1`;
	// TODO: Count workloads and events, last touch
	const result = await db.query(sql, [label]);
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
	const results = await db.query(sql, [customer, workload]);
	return results.rows;
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
	const results = await db.query(sql, [customer, workload]);
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
	const results = await db.query(sql);
	return results.rows;
}
