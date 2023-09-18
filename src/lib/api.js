import { Pool } from 'pg';

// TODO: Externalize this
const pool = new Pool({
	host: 'localhost',
	port: 5432,
	database: 'projects/google.com:cloud-spanner-demo/instances/jmakeig-test/databases/pipeline'
});

export async function get_customers() {
	const results = await pool.query(`SELECT * FROM customers`);
	return results.rows;
}

// async function set_customer(partial_customer) {}
// async function remove_customer(...ids) {}
