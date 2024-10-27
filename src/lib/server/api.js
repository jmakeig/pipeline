import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
	host: 'localhost',
	port: 5432,
	database: 'pipeline',

	user: 'pipelineadmin',
	password: '********'
});

export async function get_workloads() {
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

export async function get_events() {
	const sql = `SELECT 
		customers.label, workloads.label, events.* 
		FROM events
		INNER JOIN workloads USING(workload)
		INNER JOIN customers USING(customer)
		ORDER BY events.happened_at DESC
		LIMIT100`;
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
