import { ConstraintViolation, create_connection, optional_default, prune_optional } from './db';

/**
 * @typedef {import('$lib/types').Customer} Customer
 * @typedef {import('$lib/types').Workload} Workload
 * @typedef {import('$lib/types').Event} Event
 * @typedef {import('$lib/types').SalesStage} SalesStage
 */

/**
 * @typedef {import('$lib/types').CustomerNew} CustomerNew
 * @typedef {import('$lib/types').WorkloadNew} WorkloadNew
 * @typedef {import('$lib/types').WorkloadAttributeAction} WorkloadAttributeAction
 * @typedef {import('$lib/types').EventNew} EventNew
 */

export class ValidationError extends Error {
	/**
	 *
	 * @param {import('$lib/types').Validation[]} [validations=[]]
	 * @param {Error} [original]
	 * @param {number} [code=400]
	 */
	constructor(validations = [], code = 400, original) {
		super();
		this.code = code;
		this.name = 'ValidationError';
		this.original = original;
		this.validations = validations;
	}
}

const db = create_connection();

/**
 * @param {Customer['label']} [label] Customer label
 * @returns {Promise<Array<Customer>>}
 */
export async function get_customers(label) {
	const sql = `
		SELECT
			-- Functional dependencies: https://modern-sql.com/caniuse/any_value
			c.customer, c.label, c.name, c.region, c.segment,
			COALESCE(
				JSON_AGG(
					JSON_BUILD_OBJECT(
						'workload', w.workload,
						'label', w.label,
						'name', w.name,
						'stage', w.stage,
						'size', w.size,
						'engagement_lead', w.engagement_lead,
						'last_touched', w.last_touched,
						'events', w.events
					) ORDER BY w.last_touched DESC
				) FILTER (WHERE w.workload IS NOT NULL),
				JSON_ARRAY()
			) AS workloads,
			COALESCE(
				JSON_AGG(
					JSON_BUILD_OBJECT(
						'event', e.event,
						'customer', e.customer,
						'workload', e.workload,
						'outcome', e.outcome,
						'happened_at', e.happened_at
					)
					ORDER BY e.happened_at DESC
				) FILTER (WHERE e.event IS NOT NULL),
				JSON_ARRAY()
			) AS events,
			GREATEST(
				MAX(w.last_touched),
				MAX(e.happened_at)
 			) AS last_touched
		FROM customers AS c
		LEFT JOIN (
			-- How do I do this without a sub-select?
			SELECT
				wo.workload,
				wo.customer,
				ANY_VALUE(wo.label) AS label,
				ANY_VALUE(wo.name) AS name,
				ANY_VALUE(wo.stage) AS stage,
				ANY_VALUE(wo.size) AS size,
				ANY_VALUE(wo.engagement_lead) AS engagement_lead,
				ANY_VALUE(wo.last_touched) AS last_touched,
				JSON_AGG(
					JSON_BUILD_OBJECT(
						'event', ev.event,
						'outcome', ev.outcome,
						'happened_at', ev.happened_at
					)
				) AS events
			FROM workloads AS wo
			LEFT JOIN events AS ev USING(workload)
			GROUP BY wo.workload, wo.customer
		) AS w ON c.customer = w.customer
		LEFT JOIN events AS e ON c.customer = e.customer
		WHERE TRUE
			AND ($1::text IS NULL OR c.label = $1)
			--AND (NULL::text IS NULL OR c.label = '')
		GROUP BY c.customer
		ORDER BY name
		LIMIT 100
`;
	const results = await db.readonly(sql, [label]);
	return results.rows;
}

/*
 * @param {Customer['label']} label
 * @returns {Promise<Customer>}
 */
/*
export async function get_customer(label) {
	// Assumes w alias for workloads and s alias for sales_stages
	const workload_obj = `
		JSON_BUILD_OBJECT(
			'workload', w.workload,
			'label', w.label,
			'name', w.name,
			'stage', CASE WHEN w.stage IS NULL THEN NULL ELSE JSON_BUILD_OBJECT('stage', s.stage, 'name', s.name) END,
			'last_touched', last_touched
		)`;
	const sql = `
	WITH
		-- TODO: This should be a view
		-- workloads plus the most recent related event date
		_workloads_ext AS (
			SELECT
				_w.*,
				_e.last_touched
			FROM workloads AS _w
			LEFT JOIN (
				SELECT
					workload,
					MAX(happened_at) AS last_touched
				FROM events
				GROUP BY workload
			) AS _e USING(workload)
		),
		-- workloads keyed by customer, aggregated into a JSON array of JSON objects
		_workloads_obj AS (
			SELECT
				w.customer,
				JSON_AGG(${workload_obj}) AS workloads
			FROM _workloads_ext AS w
			LEFT JOIN sales_stages AS s USING(stage)
			GROUP BY w.customer
		),
		-- events keyed by customer aggregated as a JSON array of JSON objects
		_events_obj AS (
			SELECT
				customer,
				JSON_AGG(
					JSON_BUILD_OBJECT(
						'event', event,
						'workload', workload,
						'outcome', outcome,
						'happened_at', happened_at
					)
				) AS events
			FROM (
				(
					-- Joins on workload
					SELECT
						c.customer,
						${workload_obj} AS workload,
						e.event,
						e.outcome,
						e.happened_at
					FROM events AS e
					INNER JOIN _workloads_ext AS w ON e.workload = w.workload
					INNER JOIN customers AS c ON w.customer = c.customer
					INNER JOIN sales_stages AS s ON w.stage = s.stage
				) UNION ALL (
					-- Joins on customer
					SELECT
						c.customer,
						NULL AS workload,
						e.event,
						e.outcome,
						e.happened_at
					FROM events AS e
					INNER JOIN customers AS c USING(customer)
				)
				ORDER BY
					happened_at DESC
			)
			GROUP BY
				customer
		)
		SELECT
			c.customer,
			c.label,
			c.name,
			c.region,
			c.segment,
			w.workloads,
			e.events
		FROM customers AS c
		LEFT JOIN _workloads_obj AS w USING(customer)
		LEFT JOIN _events_obj AS e USING(customer)
		WHERE c.label = $1`;
	// TODO: Count workloads and events, last touch
	const result = await db.readonly(sql, [label]);
	return result.rows[0];
}
*/

/**
 * @param {Customer['label']} [customer] Customer label
 * @param {Workload['label']} [workload] Workload label
 * @returns {Promise<Array<Workload>>}
 */
export async function get_workloads(customer, workload) {
	// const sql = `SELECT
	// 		w.workload,
	// 		w.label,
	// 		w.name,
	// 		w.customer,
	// 		c.label AS customer_label,
	// 		c.name AS customer_name,
	// 		c2.last_happened_at,
	// 		c2.events_count
	// 	FROM workloads AS w
	// 	INNER JOIN customers AS c USING(customer)
	// 	LEFT JOIN (
	// 		SELECT
	// 			e.workload,
	// 			MAX(e.happened_at) AS last_happened_at,
	// 			COUNT(e.happened_at) AS events_count
	// 		FROM events AS e
	// 		WHERE e.workload IS NOT NULL
	// 		GROUP BY e.workload
	// 	) AS c2 USING(workload)
	// 	WHERE TRUE
	// 		AND ($1::text IS NULL OR c.label = $1)
	// 		AND ($2::text IS NULL OR w.label = $2)
	// 	LIMIT 100 /* TODO: Need pagination */
	// 	`;
	// console.log('get_workloads', sql, [...arguments]);
	const sql = `
		SELECT
			wo.workload,
			ANY_VALUE(wo.label) AS label,
			ANY_VALUE(wo.name) AS name,
			--wo.customer,
			JSON_AGG(DISTINCT cu) AS customer,
			ANY_VALUE(wo.stage) AS stage, -- TODO
			ANY_VALUE(wo.size) AS size,
			ANY_VALUE(wo.engagement_lead) AS engagement_lead,
			ANY_VALUE(wo.last_touched) AS last_touched,
			--COUNT(ev),
			COALESCE(
				JSON_AGG(
					JSON_BUILD_OBJECT(
						'event', ev.event,
						'outcome', ev.outcome,
						'happened_at', ev.happened_at
					)
				) FILTER (WHERE ev.event IS NOT NULL),
				JSON_ARRAY()
			) AS events
		FROM workloads AS wo
		LEFT JOIN events AS ev ON wo.workload = ev.workload
		JOIN customers AS cu ON wo.customer = cu.customer
		WHERE TRUE
			AND ($1::text IS NULL OR wo.label = $1)
			--AND (NULL::text IS NULL OR wo.label = '$1')
		GROUP BY wo.workload
		ORDER BY name ASC
	`;
	const results = await db.readonly(sql, [workload]);
	return results.rows;
}

/**
 *
 * @param {import('$lib/types').CustomerNew} customer
 * @returns {Promise<CustomerNew>}
 */
export async function add_customer({ name, label, region, segment }) {
	const sql = `
		INSERT INTO customers(name, label, region, segment)
		VALUES ($1, $2, $3, $4)
		RETURNING customer, name, label, region, segment`;
	let results;
	try {
		results = await db.query(sql, [name, label, region || null, segment || null]);
	} catch (err) {
		if (err instanceof ConstraintViolation) {
			throw new ValidationError(
				[{ for: 'name', message: `Customer “${name}” (${label}) already exists.` }],
				409,
				err
			);
		}
		throw err;
	}
	return results.rows[0];
}

/**
 * @param {WorkloadNew} workload
 * @returns {Promise<WorkloadNew>}
 */
export async function add_workload({ customer, name, label, stage }) {
	const sql = `
		INSERT INTO workloads(customer, name, label, stage)
		VALUES ($1, $2, $3, $4)
		RETURNING workload, customer, name, label, stage`;
	let results;
	try {
		results = await db.query(sql, [customer, name, label, stage || null]);
	} catch (err) {
		if (err instanceof ConstraintViolation) {
			throw new ValidationError(
				[{ for: 'name', message: `Workload “${name}” (${label}) already exists.` }],
				409,
				err
			);
		}
		throw err;
	}
	return results.rows[0];
}

/**
 *
 * @param {Customer['label']} [customer] Customer label
 * @param {Workload['label']} [workload] Workload label
 * @returns {Promise<Array<Event>>}
 */
export async function get_events(customer, workload) {
	const sql = `(
			-- Join on workload, ignore NULL customer
			SELECT
				e.event,
				c.label AS customer_label,
				c.name AS customer_name,
				w.label AS workload_label,
				w.name AS workload_name,
				e.outcome,
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
				e.event,
				c.label AS customer_label,
				c.name AS customer_name,
				NULL AS workload_label,
				NULL AS workload_name,
				e.outcome,
				e.happened_at
			FROM events AS e
			INNER JOIN customers AS c ON e.customer = c.customer
			WHERE TRUE
				AND ($1::text IS NULL OR c.label = $1)
		)
		ORDER BY happened_at DESC
		LIMIT 100 /* TODO: Need pagination */
		`;
	const results = await db.readonly(sql, [customer, workload]);
	return results.rows;
}

/**
 * @param {EventNew} event
 * @returns {Promise<EventNew>}
 */
export async function add_event({ workload, customer, outcome, happened_at }) {
	const sql = `
		INSERT INTO events(workload, customer, outcome, happened_at)
		VALUES ($1, $2, $3, ${optional_default(happened_at, 4)})
		RETURNING event, workload, customer, outcome, happened_at --NO PARENS!
	`;
	// console.log(sql, [workload, customer, outcome, happened_at]);
	const results = await db.query(sql, prune_optional([workload, customer, outcome, happened_at]));
	return results.rows[0];
}

/**
 * @typedef {string | number | Date} SND
 * @param {SND | symbol | undefined} value
 * @param {keyof flags} type
 * @returns {SND | (() => string | number) | undefined}
 */
function deleted(value, type) {
	const flags = {
		number: -999,
		string: '\uFFFD',
		date: 'to_timestamp(0)'
	};

	if (undefined === value) return value;
	if ('symbol' === typeof value) {
		if (Symbol.for('DELETED') === value) return () => flags[type];
		throw new TypeError(`${String(value)} is not Symbol.for('DELETED')`);
	}
	return value;
}

/**
 * @param {EventNew} event
 * @param {WorkloadAttributeAction} workoad
 * @returns {Promise<EventNew>}
 */
//export async function add_event_workload(workload, outcome, stage, size, engagement_lead) {
export async function add_event_workload({ workload, outcome }, { stage, size }) {
	const attributes = {
		workload,
		stage: deleted(stage, 'number'),
		size: deleted(size, 'number')
	};
	console.log(workload, outcome, stage, size);

	let i = 0;
	const columns = Object.entries(attributes)
		.filter((entry) => undefined !== entry[1])
		.map((entry) => entry[0]);
	const values = Object.entries(attributes)
		.filter((entry) => undefined !== entry[1])
		.map((entry) => ('function' === typeof entry[1] ? entry[1]() : `$${++i}`));
	const params = Object.entries(attributes)
		.filter((entry) => undefined !== entry[1])
		.filter((entry) => 'function' !== typeof entry[1])
		.map((entry) => entry[1]);

	// console.log('columns', columns.join(', '));
	// console.log('values', values.join(', '));
	// console.log('params', params);

	const append_attributes = `
		INSERT INTO workload_attributes (${columns.join(', ')})
		VALUES (${values.join(', ')})
	`;

	const insert_event = `
		INSERT INTO events(workload, outcome)
		VALUES ($1, $2)
		RETURNING event, workload, outcome
	`;

	// console.log(append_attributes, params);

	const results = await db.transaction(
		(client) => (
			client.query(append_attributes, params), client.query(insert_event, [workload, outcome])
		)
	);
	return results.rows[0];
}

/**
 * Union of customers and workloads. Used to build the dropdown for Events.
 *
 * @param {Customer['label']} [customer]
 * @returns {Promise<Array<{workload: Workload['workload']?, workload_label: Workload['label']?, workload_name: Workload['name']?, customer: Customer['customer'], customer_label: Customer['label'], customer_name: Customer['name']}>>}
 */
export async function get_customer_workloads(customer) {
	const sql = `
	(
		SELECT
			w.workload,
			w.label AS workload_label,
			w.name AS workload_name,
			c.customer,
			c.label AS customer_label,
			c.name AS customer_name
		FROM workloads AS w
		INNER JOIN customers AS c USING(customer)
	) UNION ALL (
		SELECT
			NULL AS workload,
			NULL AS workload_label,
			NULL AS workload_name,
			c.customer,
			c.label AS customer_label,
			c.name AS customer_name
		FROM customers AS c
	)
	ORDER BY
		workload_name ASC,
		customer_name ASC`;
	const results = await db.readonly(sql);
	return results.rows;
}

/**
 * Active workloads order by descending “urgency”, where urgency is
 * a function of size, age, stage, and customer segment.
 *
 * @returns {Promise<Array<{workload: Workload, urgnecy: number}>>}
 */
export async function get_workload_urgency() {
	const sql = `
		WITH follow_ups AS (
			SELECT
				JSON_BUILD_OBJECT(
					'workload', JSON_BUILD_OBJECT(
							'workload', w.workload,
							'name', w.name,
							'label', w.label,
							'customer', ROW_TO_JSON(c),
							'stage', ROW_TO_JSON(s),
							'size', w.size,
							'last_touched', e.last_touched,
							'event_count', e.event_count
					),
					'urgency', 0
						-- Stage
						+ CASE WHEN w.stage BETWEEN 2 AND 3 THEN 250
								WHEN w.stage IS NULL THEN 100
								WHEN w.stage = 4 THEN 100
								WHEN w.stage = 1 THEN 50
								WHEN w.stage = 98 THEN -10
								ELSE -100
							END
						-- Segment
						+ CASE WHEN 'Select' = c.segment THEN 100
							WHEN 'Enterprise' = c.segment THEN 50
							WHEN 'Corporate' = c.segment THEN 10
							ELSE -10
						END
						-- Opportunity size
						+ (COALESCE(w.size, 0.0) / 10^5)::int
						-- Age
						+ (COALESCE(DATE_PART('days', now() - e.last_touched), 0) * 1.2)::int
				) AS follow_up
			FROM workloads AS w
			INNER JOIN customers AS c ON w.customer = c.customer
			LEFT JOIN (
				SELECT
					workload,
					COUNT(event) AS event_count,
					MAX(happened_at) AS last_touched
				FROM events GROUP BY workload
			) AS e ON w.workload = e.workload
			LEFT JOIN sales_stages AS s ON w.stage = s.stage
		)
		-- Using a CTE so I don’t have to repeat the urgency
		-- logic in the sort expression
		SELECT follow_up
		FROM follow_ups
		ORDER BY
			(follow_up ->> 'urgency')::int DESC`;
	const results = await db.readonly(sql);
	// TODO: This is weird. Why does it add an extra layer?
	return results.rows.map((r) => r.follow_up);
}

/**
 * @param {SalesStage['stage']} [stage]
 * @returns {Promise<Array<SalesStage & { workloads: {count: number, size: number?}}>>}
 */
export async function get_stages_summary(stage) {
	const sql = `
		SELECT
			s.stage,
			s.name,
			JSON_BUILD_OBJECT(
				'count', COUNT(w),
				'size', SUM(w.size)
			) AS workloads
		FROM sales_stages AS s
		LEFT JOIN workloads AS w ON s.stage = w.stage
		--WHERE s.stage < 5
		WHERE s.stage >= 0
		GROUP BY s.stage
		ORDER BY s.stage ASC`;
	const results = await db.readonly(sql);
	return results.rows;
}

/**
 *
 * @returns {Promise<number?>}
 */
export async function get_pipeline_size() {
	const sql = `
		SELECT
			SUM(w.size) AS size
		FROM workloads AS w
		WHERE w.stage < 5`;
	const results = await db.readonly(sql);
	if (results.rowCount) return results.rows[0].size;
	return null;
}
