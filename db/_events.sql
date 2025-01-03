WITH _workloads AS (
	SELECT
		w.workload
		,w.label
		,w.name
		,c.customer
		,s.stage
		,w.size
		,w.engagement_lead
		,w.last_touched
	FROM workloads AS w
	JOIN LATERAL(
		SELECT
			JSON_BUILD_OBJECT(
				'customer', c.customer
				,'label', c.label
				,'name', c.name
				,'region', c.region
				,'segment', c.segment
				,'lead', c.lead
			) AS customer
		FROM customers AS c
		WHERE c.customer = w.customer
	) AS c ON true
	LEFT JOIN LATERAL (
		SELECT
			JSON_BUILD_OBJECT(
				'stage', s.stage
				,'name', s.name
			) AS stage
		FROM sales_stages AS s
		WHERE
			s.stage = w.stage
	) AS s ON true
)
SELECT
	e.event
	,w.workload
	,c.customer
	,e.outcome
	,e.happened_at
FROM events AS e -- 50
LEFT JOIN LATERAL (
	SELECT
		ROW_TO_JSON(w) AS workload
		,w.label AS label
	FROM _workloads AS w
	WHERE w.workload = e.workload
) AS w ON true
LEFT JOIN LATERAL(
	SELECT
		JSON_BUILD_OBJECT(
			'customer', c.customer
			,'label', c.label
			,'name', c.name
			,'region', c.region
			,'segment', c.segment
			,'lead', c.lead
		) AS customer
		,c.label AS label
	FROM customers AS c
	WHERE c.customer = e.customer
) AS c ON true
WHERE TRUE
	AND (NULL::text IS NULL OR c.label = '$1')
	AND (NULL::text IS NULL OR w.label = '$2')
ORDER BY
	e.happened_at DESC
