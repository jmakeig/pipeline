ALTER DATABASE pipeline SET DEFAULT_TRANSACTION_ISOLATION TO 'serializable';

-- DROP SCHEMA public CASCADE;
-- CREATE SCHEMA public;

DROP TABLE IF EXISTS events;
DROP VIEW IF EXISTS workloads;
DROP TABLE IF EXISTS workload_attributes;
DROP INDEX IF EXISTS workloads_label;
DROP TABLE IF EXISTS _workloads;
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

CREATE TABLE IF NOT EXISTS _workloads (
  workload uuid DEFAULT gen_random_uuid(),
  label text NOT NULL,
  name text NOT NULL,
  customer uuid NOT NULL REFERENCES customers(customer) ON DELETE RESTRICT,
	--stage smallint REFERENCES sales_stages(stage),
	--size int,
	--lead text,
  PRIMARY KEY(workload)
);
CREATE UNIQUE INDEX workloads_label ON _workloads(customer, LOWER(label));

CREATE TABLE IF NOT EXISTS workload_attributes (
	attribute uuid DEFAULT gen_random_uuid(),
	workload uuid REFERENCES _workloads(workload),
	stage smallint REFERENCES sales_stages(stage),
	size int,
	engagement_lead text,
	updated_at timestamptz DEFAULT transaction_timestamp(),
	PRIMARY KEY (workload, attribute)
);

CREATE OR REPLACE VIEW workloads AS
  SELECT
      w.workload,
			w.label,
			w.name,
      w.customer,
      a.stage,
      a.size,
			a.engagement_lead
  FROM _workloads AS w
  LEFT JOIN (
    SELECT
        DISTINCT ON(workload)
        workload,
        stage,
        size,
				engagement_lead,
        updated_at
    FROM workload_attributes
    ORDER BY workload, updated_at DESC
  ) AS a USING(workload)
;

CREATE TABLE IF NOT EXISTS events (
  event uuid DEFAULT gen_random_uuid(),
  customer uuid REFERENCES customers(customer) ON DELETE RESTRICT,
  workload uuid REFERENCES _workloads(workload) ON DELETE RESTRICT,
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
