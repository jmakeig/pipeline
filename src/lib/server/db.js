// import 'dotenv/config';
import pg from 'pg';

export class ConstraintViolation extends Error {
	/**
	 *
	 * @param {Error} original
	 */
	constructor(original) {
		super(original.message);
		this.name = 'ConstraintViolation';
		this.original = original;
	}
}

/**
 *
 * @param {Error & {code: number | string}} error
 * @returns {Error}
 */
function wrap_error(error) {
	// https://www.postgresql.org/docs/9.6/errcodes-appendix.html
	if ('23505' === error.code) {
		// https://github.com/googleapis/googleapis/blob/master/google/rpc/code.proto#L84
		// if (6 === error.code) {
		return new ConstraintViolation(error);
	}
	return error;
}

export function create_connection() {
	/**
	 * Initialize the connection pool.
	 * Gets the connection config from `.env`.
	 *
	 * @returns {pg.Pool}
	 */
	function connect() {
		/** @type {pg.PoolConfig} */
		const config = {
			host: 'localhost',
			port: 5432,
			database: 'pipeline',

			user: 'pipelineadmin',
			password: '********'
		};
		return new pg.Pool(config);
	}

	/** @type {pg.Pool} */
	const connection = connect();

	return {
		/** @type {pg.Pool} */
		get connection() {
			return connection;
		},
		/**
		 * Close the connection pool.
		 *
		 * @returns {Promise<void>}
		 */
		async close() {
			return await connection.end();
		},
		/**
		 * Wraps a callback in a database transaction. Thrown errors will rollaback.
		 *
		 * @param {function(pg.PoolClient): Promise<pg.QueryResult<any>>} runner
		 * @returns {Promise<pg.QueryResult<any>>}
		 */
		async transaction(runner) {
			const client = await connection.connect();
			let res;
			try {
				await client.query('BEGIN');
				try {
					res = await runner(client);
					await client.query('COMMIT');
					return res;
				} catch (/** @type {any} */ err) {
					await client.query('ROLLBACK');
					throw wrap_error(err);
				}
			} finally {
				client.release();
			}
		},
		/**
		 * Single-statement query that requires no cleanup.
		 *
		 * @param {string} statement
		 * @param {any[]} [params = []]
		 * @returns {Promise<pg.QueryResult<any>>}
		 */
		async query(statement, params = []) {
			try {
				return await connection.query(statement, params);
			} catch (/** @type {any} */ err) {
				throw wrap_error(err);
			}
		}
	};
}

/**
 *
 * @param {any | undefined} value
 * @param {number} [param=1]
 * @returns {string}
 */
export function optional_default(value, param = 1) {
	if (undefined === value) return 'DEFAULT';
	return `$${param}`;
}

/**
 *
 * @param {Array<any>} params
 * @returns {Array<any>}
 */
export function prune_optional(params) {
	return params.filter(v => undefined !== v);
}
