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
	}
};
// async function set_customer(partial_customer) {}
// async function remove_customer(...ids) {}
