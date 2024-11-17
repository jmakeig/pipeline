ALTER DATABASE pipeline SET DEFAULT_TRANSACTION_ISOLATION TO 'serializable';

DROP TABLE IF EXISTS events;
DROP INDEX IF EXISTS workloads_label;
DROP TABLE IF EXISTS workloads;
DROP TABLE IF EXISTS sales_stages;
DROP INDEX IF EXISTS customers_label;
DROP TABLE IF EXISTS customers;


CREATE TABLE IF NOT EXISTS customers (
  customer uuid DEFAULT gen_random_uuid(),
  label text NOT NULL,
  name text NOT NULL,
	region text, 		-- TODO: Lookup
	segment text, 	-- TODO: Lookup,
	lead text,
  PRIMARY KEY(customer)
);
CREATE UNIQUE INDEX customers_label ON customers(LOWER(label));

CREATE TABLE IF NOT EXISTS sales_stages (
	stage smallint NOT NULL,
	name text NOT NULL UNIQUE,
	PRIMARY KEY(stage)
);

CREATE TABLE IF NOT EXISTS workloads (
  workload uuid DEFAULT gen_random_uuid(),
  label text NOT NULL,
  name text NOT NULL,
  customer uuid NOT NULL REFERENCES customers(customer) ON DELETE RESTRICT,
	stage smallint REFERENCES sales_stages(stage),
	size int,
	lead text,
  PRIMARY KEY(workload)
);
CREATE UNIQUE INDEX workloads_label ON workloads(customer, LOWER(label));

CREATE TABLE IF NOT EXISTS events (
  event uuid DEFAULT gen_random_uuid(),
  customer uuid REFERENCES customers(customer) ON DELETE RESTRICT,
  workload uuid REFERENCES workloads(workload) ON DELETE RESTRICT,
  happened_at timestamptz NOT NULL DEFAULT now(),
  outcome text,
	-- Array of email addresses
	product_participants text[],
	field_participants text[],
	customer_participants text[],
  PRIMARY KEY(event),
  CHECK (
       (customer IS NULL AND workload IS NOT NULL)
    OR (customer IS NOT NULL AND workload IS NULL)
  )
);
