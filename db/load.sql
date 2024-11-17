DELETE FROM events WHERE true;
DELETE FROM workload_attributes WHERE true;
DELETE FROM _workloads WHERE true;
DELETE FROM sales_stages WHERE true;
DELETE FROM customers WHERE true;


-- Customers
INSERT INTO customers(label, name, region, segment) VALUES
	('acme', 'Acme Corp.', 'NORTHAM', 'Enterprise'),
	('beta', 'Beta LLC', 'EMEA', 'Select')
;

-- Sales Stages
INSERT INTO sales_stages(stage, name) VALUES
	(0, 'Qualify'),
	(1, 'Refine'),
	(2, 'Tech Eval/Solution Dev'),
	(3, 'Proposal Negotiation'),
	(4, 'Migration/Implementation'),
	(5, 'Live/Production'),
	(97, 'Qualified Out'),
	(98, 'Stalled'),
	(99, 'Lost'),
	(100, 'Closed')
;

-- Workloads
INSERT INTO _workloads(label, name, customer) VALUES
	('customer360', 'Customer 360º', (SELECT customer FROM customers WHERE label = 'acme')),
	('ledger', 'Global Ledger', (SELECT customer FROM customers WHERE label = 'beta')),
	('workflow', 'Workflow metadata', (SELECT customer FROM customers WHERE label = 'acme'))
;

INSERT INTO workload_attributes(workload, stage, size, engagement_lead, updated_at)
VALUES
	((SELECT workload FROM _workloads WHERE label = 'customer360'), 1, trunc(random()*2.5*10^6), 'jmakeig', now() - (INTERVAL '1 day' + random() * 30 * INTERVAL '1 day')),
	((SELECT workload FROM _workloads WHERE label = 'customer360'), 1, trunc(random()*2.5*10^6), 'jmakeig', now() - (INTERVAL '1 day' + random() * 30 * INTERVAL '1 day')),
	((SELECT workload FROM _workloads WHERE label = 'customer360'), 2, trunc(random()*2.5*10^6), 'jmakeig', now() - (INTERVAL '1 day' + random() * 30 * INTERVAL '1 day')),
	((SELECT workload FROM _workloads WHERE label = 'customer360'), 1, trunc(random()*2.5*10^6), 'another', now() - (INTERVAL '1 day' + random() * 30 * INTERVAL '1 day')),
	((SELECT workload FROM _workloads WHERE label = 'ledger'), 1, trunc(random()*2.5*10^6), 'jmakeig', now() - (INTERVAL '1 day' + random() * 30 * INTERVAL '1 day')),
	((SELECT workload FROM _workloads WHERE label = 'workflow'), 3, trunc(random()*2.5*10^6), 'jmakeig', now() - (INTERVAL '1 day' + random() * 30 * INTERVAL '1 day'))
;

-- Events
INSERT INTO events(customer, workload, outcome, happened_at) VALUES
	(NULL, (SELECT workloads.workload FROM workloads INNER JOIN customers USING(customer) WHERE customers.label = 'acme' ORDER BY random() LIMIT 1), 'Some stuff', now() - (trunc(random() * 5000) || ' hours')::interval),
	(NULL, (SELECT workloads.workload FROM workloads INNER JOIN customers USING(customer) WHERE customers.label = 'beta' ORDER BY random() LIMIT 1), 'And things', now() - (trunc(random() * 5000) || ' hours')::interval),
	((SELECT customer FROM customers WHERE label = 'beta'), NULL, 'This is an event with a customer, but not a workload', now() - (trunc(random() * 5000) || ' hours')::interval),
	(NULL, (SELECT workloads.workload FROM workloads INNER JOIN customers USING(customer) WHERE customers.label = 'acme' ORDER BY random() LIMIT 1), 'Some stuff', now() - (trunc(random() * 5000) || ' hours')::interval),
	(NULL, (SELECT workloads.workload FROM workloads INNER JOIN customers USING(customer) WHERE customers.label = 'beta' ORDER BY random() LIMIT 1), 'And things', now() - (trunc(random() * 5000) || ' hours')::interval),
	((SELECT customer FROM customers WHERE label = 'beta'), NULL, 'This is an event with a customer, but not a workload', now() - (trunc(random() * 5000) || ' hours')::interval),
	(NULL, (SELECT workloads.workload FROM workloads INNER JOIN customers USING(customer) WHERE customers.label = 'acme' ORDER BY random() LIMIT 1), 'Some stuff', now() - (trunc(random() * 5000) || ' hours')::interval),
	(NULL, (SELECT workloads.workload FROM workloads INNER JOIN customers USING(customer) WHERE customers.label = 'beta' ORDER BY random() LIMIT 1), 'And things', now() - (trunc(random() * 5000) || ' hours')::interval),
	((SELECT customer FROM customers WHERE label = 'acme'), NULL, 'This is an event with a customer, but not a workload', now() - (trunc(random() * 5000) || ' hours')::interval)
;

/*
SELECT
	customers.label, workloads.label, events.*
FROM events
INNER JOIN workloads USING(workload)
INNER JOIN customers USING(customer)
ORDER BY events.happened_at DESC
;
*/
