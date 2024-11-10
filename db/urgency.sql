WITH _report AS (
	SELECT
		JSON_BUILD_OBJECT(
			'workload', JSON_BUILD_OBJECT(
				'workload', w.workload,
				'label', w.label,
				'name', w.name,
				'customer', ROW_TO_JSON(c),         -- TODO: Make this explicit
				'stage', ROW_TO_JSON(ANY_VALUE(s)), -- TODO: Make this explicit
				'size', w.size,
				'lead', w.lead,
				'last_touched', MAX(e.happened_at),
				'event_count', COUNT(e)
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
				+ (COALESCE(DATE_PART('days', now() - MAX(e.happened_at)), 0) * 1.2)::int
		) AS follow_up
	FROM workloads AS w
	INNER JOIN customers AS c ON w.customer = c.customer
	LEFT JOIN events AS e ON w.workload = e.workload
	LEFT JOIN sales_stages AS s ON w.stage = s.stage
	WHERE TRUE
		AND (w.stage <= 5 OR w.stage = 98 OR w.stage IS NULL)
	GROUP BY
		c.customer,
		w.workload
)
-- Using a CTE so I don’t have to repeat the urgency
-- logic in the sort expression
SELECT follow_up
FROM _report
ORDER BY
	(follow_up ->> 'urgency')::int DESC
