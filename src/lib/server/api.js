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
		RETURNING (event, workload, customer, outcome, happened_at)
	`;
	console.log(sql, [workload, customer, outcome, happened_at]);
	const results = await db.query(sql, prune_optional([workload, customer, outcome, happened_at]));
	// return results.fields.reduce((out, field, i) => out[field.name] = results.rows[i], {});
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
