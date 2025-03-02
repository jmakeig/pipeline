-- https://bigmachine.io/database/fine-tuning-full-text-search-with-postgresql-12
SELECT
	event
	,ts_headline(outcome, search, 'StartSel=<mark>,StopSel=</mark>') AS snippet
	,ts_rank(vector, search) AS rank
FROM
	events
	,to_tsvector(outcome) AS vector
	,websearch_to_tsquery($1) AS search
WHERE TRUE
	AND vector @@ search
ORDER BY
	rank DESC
LIMIT 10
;
