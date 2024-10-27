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
 * @param {string} [customer]
 * @returns 
 */
export async function get_customers(customer) {
	const sql = `SELECT c.customer, c.label, c.name FROM customers AS c LIMIT 100`;
	const results = await pool.query(sql);
	return results.rows;
}

/**
 * @param {string} [customer] 
 * @param {string} [workload] 
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
		LIMIT 100 /* TODO: Need pagination */
		`;
	const results = await pool.query(sql);
	// console.dir(results.rows);
	return results.rows;
}

/**
 *
 * @param {string} [customer]
 * @param {string} [workload]
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
