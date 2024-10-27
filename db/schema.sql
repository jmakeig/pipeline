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
  customer uuid REFERENCES customers(customer),
  PRIMARY KEY(workload),
  UNIQUE(customer, label)
);

CREATE TABLE IF NOT EXISTS events (
  event uuid DEFAULT gen_random_uuid(),
  workload uuid REFERENCES workloads(workload),
  happened_at timestamptz DEFAULT now(),
  outcome text,
  PRIMARY KEY(event)
);
