import { error } from '@sveltejs/kit';

import { Client } from 'pg';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	try {
		return await get_customers_from_database();
	} catch (err) {
		throw error(500, String(err));
	}
}

async function get_customers_from_database() {
	const client = new Client({
		host: 'localhost',
		port: 5432,
		database: 'projects/google.com:cloud-spanner-demo/instances/jmakeig-test/databases/pipeline'
	});
	console.log('about to connect')
	await client.connect();
	console.log('connected')
	const res = await client.query("select 'Hello world!' as hello");
	console.log(res.rows[0].hello);
	await client.end();
}
