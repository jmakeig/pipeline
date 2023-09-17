DELETE FROM events WHERE true;
DELETE FROM workloads WHERE true;
DELETE FROM customers WHERE true;
INSERT INTO customers (label, name_canonical) VALUES ('Acme', 'Acme Corp.');
INSERT INTO workloads (customer_id, title) 
	VALUES (
      (SELECT customer_id FROM customers WHERE label = 'Acme'),
      'Big MySQL migration'
    );
INSERT INTO events (customer_id, workload_id) 
	VALUES (
      (SELECT customer_id FROM customers WHERE label = 'Acme'),
      (SELECT workload_id FROM workloads WHERE title = 'Big MySQL migration')
    );

--SELECT * FROM events;