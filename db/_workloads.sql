SELECT
	 w.workload, w.label, w.name, w.stage, w.size, w.engagement_lead, w.last_touched
	,c.customer
	,e.events
FROM
	 workloads AS w
	,LATERAL (
		SELECT
			COALESCE(
				JSON_AGG(
					JSON_BUILD_OBJECT(
						 'event', event
						,'outcome', outcome
						,'happened_at', happened_at -- Note that the client will no longer convert this automatically
					)
					ORDER BY happened_at DESC
				)
				,JSON_ARRAY()
			)AS events
			FROM events
			WHERE workload = w.workload
	) AS e
	,LATERAL (
		SELECT
			--ROW_TO_JSON(cu.*) AS customer
			JSON_BUILD_OBJECT(
				'customer', customer
				,'name', name
				,'label', label
				,'segment', segment
				,'region', region
			) AS customer
		FROM customers
		WHERE customer = w.customer
	) AS c
WHERE TRUE
	AND (NULL::text IS NULL OR w.label = '$1')
ORDER BY
	w.name ASC

/*
SELECT COUNT(DISTINCT workload) FROM events
SELECT COUNT(workload) FROM workloads
SELECT COUNT(DISTINCT w.workload) FROM workloads AS w
LEFT JOIN events AS e USING(workload)
*/

/*
SELECT
	 w.workload
	,w.name
	,w.label
	,w.stage
	,w.size
	,w.engagement_lead
	,(SELECT JSON_BUILD_OBJECT('customer', c.customer, 'name', c.name, 'label', c.label, 'segment', c.segment, 'region', c.region) FROM customers AS c WHERE c.customer = w.customer LIMIT 1) AS customer
	,(SELECT JSON_AGG(JSON_BUILD_OBJECT('event', e.event, 'outcome', e.outcome, 'happened_at', e.happened_at)) FROM events AS e WHERE e.workload = w.workload) AS events
FROM workloads AS w
*/

--SELECT * FROM workloads


/*
SELECT
	wo.workload,
	ANY_VALUE(wo.label) AS label,
	ANY_VALUE(wo.name) AS name,
	--wo.customer,
	JSON_AGG(DISTINCT cu),
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
	--AND ($1::text IS NULL OR wo.label = $1)
	AND (NULL::text IS NULL OR wo.label = '$1')
GROUP BY wo.workload
*/

