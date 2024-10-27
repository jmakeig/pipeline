import { create_connection } from './db';

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
			c.name AS customer_name
		FROM workloads AS w
		INNER JOIN customers AS c USING(customer)
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
