import { Pool } from 'pg';

/** @typedef {import('$lib/entities').Customer} Customer */

// TODO: Externalize this
const pool = new Pool({
	host: 'localhost',
	port: 5432,
	database: 'projects/google.com:cloud-spanner-demo/instances/jmakeig-test/databases/pipeline'
});

/** @type {import('./api').API} */
export const api = {
	async list_customers() {
		const sql = `SELECT customer_id, label, name_canonical, vector_id, segment, industry FROM customers`;
		const results = await pool.query(sql);
		return results.rows;
	},
	async lookup_customers(by) {
		console.log('lookup_customers', by);
		const sql = `
		SELECT customer_id AS value, label AS label, 2 AS score
		FROM customers 
		WHERE 
			starts_with(lower(label), lower($1))
			AND length($1) > 0 --all strings start with the empty string
		UNION ALL
		SELECT customer_id AS value, name_canonical AS label, 1 AS score 
		FROM customers 
		WHERE 
			starts_with(lower(name_canonical), lower($1))
			AND length($1) > 0
		ORDER BY 
			label ASC, 
			score DESC`;
		const results = await pool.query(sql, [by]);
		return results.rows;
	},
	async lookup_workloads(by) {
		console.log('lookup_workloads', by);
		const sql = `
		SELECT workload_id AS value, title AS label
			FROM workloads
			WHERE 
				starts_with(lower(title), lower($1))
		`;
		const results = await pool.query(sql, [by]);
		return results.rows;
	},
	async list_events() {
		const sql = `SELECT event_id, customer_id, workload_id, timestamp FROM events`;
		const results = await pool.query(sql);
		return results.rows;
	}
};
// async function set_customer(partial_customer) {}
// async function remove_customer(...ids) {}
