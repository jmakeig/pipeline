import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
	host: 'localhost',
	port: 5432,
	database: 'pipeline',

	user: 'pipelineadmin',
	password: '********'
});

/**
 *
 * @param {string} [customer] Customer label
 * @returns
 */
export async function get_customers(customer) {
	const sql = `SELECT 
			c.customer, c.label, c.name 
		FROM customers AS c 
		WHERE $1::text IS NULL OR c.label = $1
		LIMIT 100`;
	const results = await pool.query(sql, [customer]);
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
	console.log('get_workloads', sql, [...arguments]);
	const results = await pool.query(sql, [customer, workload]);
	// console.dir(results.rows);
	return results.rows;
}

/**
 *
 * @param {string} [customer] Customer label
 * @param {string} [workload] Workload label
 * @returns
 */
export async function get_events(customer, workload) {
	const sql = `SELECT 
		c.label AS customer_label, 
		c.name AS customer_name,
		w.label AS workload_label,
		w.name AS workload_name,
		e.happened_at
		FROM events AS e
		INNER JOIN workloads AS w USING(workload)
		INNER JOIN customers AS c USING(customer)
		ORDER BY e.happened_at DESC
		LIMIT 100`;
	const results = await pool.query(sql);
	return results.rows;
}
/*
[
	'stack',         'message',
	'length',        'name',
	'severity',      'code',
	'detail',        'hint',
	'position',      'internalPosition',
	'internalQuery', 'where',
	'schema',        'table',
	'column',        'dataType',
	'constraint',    'file',
	'line',          'routine'
]
*/
