-- Drop, order matters
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS workloads;
DROP INDEX IF EXISTS customer_label;
DROP TABLE IF EXISTS customers;

-- Create, order matters

-- customers
CREATE TABLE IF NOT EXISTS customers (
	--customer_id   varchar(36) UNIQUE NOT NULL DEFAULT gen_random_uuid()::varchar(36),
	customer_id     varchar(36) NOT NULL DEFAULT spanner.generate_uuid()::varchar(36),
	label           text NOT NULL,
	name_canonical  text,
	vector_id       text,
  segment         text,
	industry        text,
	PRIMARY KEY (customer_id)
);
-- UNIQUE constraint
CREATE UNIQUE INDEX customer_label ON customers (label);

-- workloads
CREATE TABLE IF NOT EXISTS workloads (
	--workload_id   varchar(36) UNIQUE NOT NULL DEFAULT gen_random_uuid()::varchar(36),
	workload_id     varchar(36) NOT NULL DEFAULT spanner.generate_uuid()::varchar(36),
	customer_id     varchar(36) NOT NULL REFERENCES customers(customer_id),
	product         text NOT NULL DEFAULT 'Cloud Spanner',
	title           text,
	description     text,
	vector_id       text,
	size            numeric,
	win_date        date,
	confidence      int,
	PRIMARY KEY (workload_id)
);

-- events
CREATE TABLE IF NOT EXISTS events (
	--event_id      varchar(36) UNIQUE NOT NULL DEFAULT gen_random_uuid()::varchar(36),
	event_id        varchar(36) NOT NULL DEFAULT spanner.generate_uuid()::varchar(36),
	customer_id     varchar(36) NOT NULL REFERENCES customers(customer_id),
	workload_id     varchar(36) REFERENCES workloads(workload_id),
	timestamp       timestamptz NOT NULL DEFAULT now(),
	PRIMARY KEY (event_id)
);

