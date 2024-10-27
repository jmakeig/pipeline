DROP TABLE IF EXISTS workloads;

CREATE TABLE IF NOT EXISTS workloads (
  id uuid DEFAULT gen_random_uuid (),
  label text UNIQUE,
  PRIMARY KEY(id)
);