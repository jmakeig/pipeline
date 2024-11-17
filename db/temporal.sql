-- https://hypirion.com/musings/implementing-system-versioned-tables-in-postgres

/*
CREATE TABLE IF NOT EXISTS workloads (
  workload text, -- DEFAULT gen_random_uuid(),
  stage int,
  size numeric,
  systime tstzrange NOT NULL
  	DEFAULT(tstzrange(now(), NULL))
  	CHECK (NOT ISEMPTY(systime)),
  PRIMARY KEY(workload)
);

INSERT INTO workloads(workload, stage, size) VALUES
	('a', null, 100);

SELECT * FROM workloads;
*/

-- Schema

DROP INDEX IF EXISTS workloads_label;
DROP TABLE IF EXISTS workload_attributes;
DROP TABLE IF EXISTS workloads;

CREATE TABLE IF NOT EXISTS workloads (
  --workload uuid DEFAULT gen_random_uuid(),
  workload text NOT NULL,
  label text NOT NULL,
  name text NOT NULL,
  customer text NOT NULL,
  --customer uuid NOT NULL
  --	REFERENCES customers(customer) ON DELETE RESTRICT,
	--stage smallint REFERENCES sales_stages(stage),
	--size int,
	--lead text,
  PRIMARY KEY(workload)
);
CREATE UNIQUE INDEX IF NOT EXISTS workloads_label
ON workloads(customer, LOWER(label));

CREATE TABLE IF NOT EXISTS workload_attributes (
  id SERIAL,
  workload text NOT NULL REFERENCES workloads(workload),
  stage smallint,
  size numeric,
  lead text,
  updated_at timestamptz DEFAULT transaction_timestamp()
);


CREATE OR REPLACE VIEW workloads_latest AS
  SELECT
      w.workload,
      w.customer,
      a.stage,
      a.size
  FROM workloads AS w
  LEFT JOIN (
    SELECT
        DISTINCT ON(workload)
        workload,
        stage,
        size,
        updated_at
    FROM workload_attributes
    ORDER BY workload, updated_at DESC
  ) AS a USING(workload)
;

-- Data
INSERT INTO workloads
VALUES
('workload1', 'workload1', 'workload1', 'customerA'),
('workload2', 'workload2', 'workload2', 'customerB'),
('workload3', 'workload3', 'workload3', 'customerB')
;

INSERT INTO workload_attributes(workload, size, stage, updated_at)
VALUES
('workload1', 1869000, 4, '2024-11-16T16:39:32Z'),
('workload1', 8800000, 0, '2024-11-12T14:31:46Z'),
('workload1', 8772000, 2, '2024-11-12T11:06:01Z'),
('workload1', 8326000, 1, '2024-11-10T05:41:41Z'),
('workload1', 509000, 4, '2024-11-09T12:32:20Z'),
('workload1', 9646000, 4, '2024-10-24T11:17:05Z'),
('workload1', 4804000, 2, '2024-10-24T00:01:30Z'),
('workload1', 7846000, 0, '2024-10-23T01:03:12Z'),
('workload1', 6746000, 3, '2024-10-14T06:37:15Z'),
('workload1', 8732000, 1, '2024-10-13T20:26:27Z'),
('workload1', 3322000, 1, '2024-10-06T03:41:45Z'),
('workload2', 6248000, 0, '2024-11-09T21:36:50Z'),
('workload2', 6333000, 1, '2024-11-08T03:23:20Z'),
('workload2', 4933000, 3, '2024-10-28T20:17:52Z'),
('workload2', 6315000, 2, '2024-10-17T00:26:12Z'),
('workload2', 2272000, 1, '2024-10-14T04:11:20Z'),
('workload2', 2806000, 4, '2024-10-13T00:48:04Z'),
('workload2', 7120000, 0, '2024-10-04T02:26:22Z'),
('workload3', 7892000, 1, '2024-11-15T01:30:08Z'),
('workload3', 9755000, 1, '2024-11-12T09:32:19Z'),
('workload3', 6304000, 3, '2024-11-09T15:04:06Z'),
('workload3', 1998000, 0, '2024-10-18T16:20:31Z'),
('workload3', 5979000, 1, '2024-10-15T13:15:48Z'),
('workload3', 9789000, 3, '2024-10-14T23:53:16Z'),
('workload3', 1284000, 4, '2024-10-05T09:05:05Z')
;

SELECT * FROM workloads_latest
;
