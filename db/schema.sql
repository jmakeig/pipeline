DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS workloads;
DROP TABLE IF EXISTS customers;


CREATE TABLE IF NOT EXISTS customers (
  customer uuid DEFAULT gen_random_uuid(),
  label text UNIQUE,
  name text NOT NULL,
  PRIMARY KEY(customer)
);

CREATE TABLE IF NOT EXISTS workloads (
  workload uuid DEFAULT gen_random_uuid(),
  label text NOT NULL,
  name text NOT NULL,
  customer uuid NOT NULL REFERENCES customers(customer) ON DELETE RESTRICT,
  PRIMARY KEY(workload),
  UNIQUE(customer, label)
);

CREATE TABLE IF NOT EXISTS events (
  event uuid DEFAULT gen_random_uuid(),
  customer uuid REFERENCES customers(customer) ON DELETE RESTRICT,
  workload uuid REFERENCES workloads(workload) ON DELETE RESTRICT,
  happened_at timestamptz NOT NULL DEFAULT now(),
  outcome text,
  PRIMARY KEY(event),
  CHECK (
       (customer IS NULL AND workload IS NOT NULL)
    OR (customer IS NOT NULL AND workload IS NULL)
  )
);
