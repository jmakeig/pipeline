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
	const sql = `SELECT label FROM workloads`;
	const results = await pool.query(sql);
	// console.dir(results.rows);
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
