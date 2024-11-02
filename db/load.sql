DELETE FROM events WHERE true;
DELETE FROM workloads WHERE true;
DELETE FROM customers WHERE true;

-- Customers
INSERT INTO customers(label, name) VALUES
	('acme', 'Acme Corp.'),
	('beta', 'Beta LLC')
;

-- Sales Stages
INSERT INTO sales_stages(stage, label) VALUES
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
INSERT INTO workloads(label, name, customer, stage) VALUES
	('customer360', 'Customer 360º', (SELECT customer FROM customers WHERE label = 'acme'), 1),
	('ledger', 'Global Ledger', (SELECT customer FROM customers WHERE label = 'beta'), 0),
	('workflow', 'Workflow metadata', (SELECT customer FROM customers WHERE label = 'acme'), 3)
;

-- Events
INSERT INTO events(customer, workload, outcome) VALUES
	(NULL, (SELECT workloads.workload FROM workloads INNER JOIN customers USING(customer) WHERE customers.label = 'acme' ORDER BY random() LIMIT 1), 'Some stuff'),
	(NULL, (SELECT workloads.workload FROM workloads INNER JOIN customers USING(customer) WHERE customers.label = 'beta' ORDER BY random() LIMIT 1), 'And things'),
	((SELECT customer FROM customers WHERE label = 'beta'), NULL, 'And things')
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
