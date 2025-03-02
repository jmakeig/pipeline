-- Events
SELECT
	'event' AS entity
	,event AS id
	,ts_headline(outcome, search, 'StartSel=<mark>,StopSel=</mark>') AS snippet
	,ts_rank(vector, search) AS rank
FROM
	events
	,to_tsvector('english', outcome) AS vector
	,plainto_tsquery('english', $1) AS search
WHERE TRUE
	AND vector @@ search
UNION ALL
-- Workloads
SELECT
	'workload' AS entity
	,workload AS id
	,ts_headline(name, search, 'StartSel=<mark>,StopSel=</mark>') AS snippet
	,ts_rank(vector, search) AS rank
FROM
	workloads
	,to_tsvector('simple', name) AS vector
	,plainto_tsquery('simple', $1) AS search
WHERE TRUE
	AND vector @@ search
UNION ALL
-- Cusotmers
SELECT
	'customer' AS entity
	,customer AS id
	,ts_headline(name, search, 'StartSel=<mark>,StopSel=</mark>') AS snippet
	,ts_rank(vector, search) AS rank
FROM
	customers
	,to_tsvector('simple', name) AS vector
	,plainto_tsquery('simple', $1) AS search
WHERE TRUE
	AND vector @@ search

;
