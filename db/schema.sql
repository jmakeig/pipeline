DROP TABLE IF EXISTS customers;
CREATE TABLE IF NOT EXISTS customers (
  customer uuid DEFAULT gen_random_uuid(),
  label text UNIQUE,
  name text,
  PRIMARY KEY(customer)
);


DROP TABLE IF EXISTS workloads;
CREATE TABLE IF NOT EXISTS workloads (
  workload uuid DEFAULT gen_random_uuid(),
  label text UNIQUE,
  customer uuid REFERENCES customers(customer),
  PRIMARY KEY(workload)
);

DROP TABLE IF EXISTS events;
CREATE TABLE IF NOT EXISTS events (
  event uuid DEFAULT gen_random_uuid(),
  workload uuid REFERENCES workloads(workload),
  happened_at timestamptz DEFAULT now(),
  outcome text,
  PRIMARY KEY(event)
);
