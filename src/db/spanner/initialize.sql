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

INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Stellar Solutions', 'Stellar Solutions Inc.', 'SMB', 'Manufacturing');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Envision Consulting', 'Envision Consulting Group', 'Corporate', 'Real Estate');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Summit Ventures', 'Summit Ventures LLC', 'Select', 'Travel and Leisure');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('BlueSky Innovations', 'BlueSky Innovations', 'Select', 'Travel and Leisure');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('BrightPath Enterprises', 'BrightPath Enterprises', 'Enterprise', 'Manufacturing');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Dynamic Directions', 'Dynamic Directions Inc.', 'Select', 'Media and Entertainment');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Proven Progress', 'Proven Progress LLC', 'Select', 'Travel and Leisure');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Redwood Partners', 'Redwood Partners', 'SMB', 'Manufacturing');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Top Tier', 'Top Tier Technologies', 'SMB', 'Real Estate');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('NextWave Industries', 'NextWave Industries', 'Select', 'Manufacturing');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Visionary Ventures', 'Visionary Ventures Inc.', 'Enterprise', 'Financial Services');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Boldly Better', 'Boldly Better Business', 'SMB', 'Media and Entertainment');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Elite Innovations', 'Elite Innovations LLC', 'Corporate', 'Media and Entertainment');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Future Foresight', 'Future Foresight Group', 'SMB', 'Real Estate');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Precision Partners', 'Precision Partners Inc.', 'Select', 'Media and Entertainment');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Stellar Strategies', 'Stellar Strategies', 'Select', 'Financial Services');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Apex Advancement', 'Apex Advancement Group', 'Corporate', 'Media and Entertainment');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Ignite Ideas', 'Ignite Ideas LLC', 'Corporate', 'Manufacturing');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Thrive Consulting', 'Thrive Consulting Co.', 'Select', 'Real Estate');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Fortitude Funding', 'Fortitude Funding Co.', 'Enterprise', 'Manufacturing');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Bluebird Brands', 'Bluebird Brands', 'Select', 'Logistics');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Nimbus Networks', 'Nimbus Networks Inc.', 'Enterprise', 'Travel and Leisure');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Inception Industries', 'Inception Industries', 'SMB', 'Manufacturing');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Titan Technologies', 'Titan Technologies', 'Enterprise', 'Travel and Leisure');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Progress Partners', 'Progress Partners LLC', 'Corporate', 'Manufacturing');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Catalyst Consulting', 'Catalyst Consulting Group', 'Select', 'Real Estate');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Inspired Intelligence', 'Inspired Intelligence Inc.', 'SMB', 'Financial Services');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Phoenix Partnerships', 'Phoenix Partnerships', 'Select', 'Healthcare');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('NextGen Innovations', 'NextGen Innovations LLC', 'Corporate', 'Healthcare');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Precision Progress', 'Precision Progress Inc.', 'Select', 'Manufacturing');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Fortitude Frontiers', 'Fortitude Frontiers', 'Enterprise', 'Travel and Leisure');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Nimbus Network', 'Nimbus Network Solutions', 'SMB', 'Healthcare');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Inception Innovations', 'Inception Innovations', 'SMB', 'Media and Entertainment');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Titan Transformation', 'Titan Transformation Co.', 'Corporate', 'Media and Entertainment');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Vertex Ventures', 'Vertex Ventures Group', 'Corporate', 'Travel and Leisure');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Progress Progression', 'Progress Progression Partners', 'Select', 'Travel and Leisure');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Catalystic Concepts', 'Catalystic Concepts Co.', 'Corporate', 'Media and Entertainment');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Inspired Ideals', 'Inspired Ideals LLC', 'Select', 'Financial Services');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Phoenix Performance', 'Phoenix Performance Partners', 'Select', 'Logistics');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Inflection Point', 'Inflection Point Progression', 'Select', 'Travel and Leisure');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Pinnacle Performance', 'Pinnacle Performance Solutions', 'Select', 'Real Estate');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Prime Progression', 'Prime Progression LLC', 'Corporate', 'Media and Entertainment');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Eclipse Enterprises', 'Eclipse Enterprises Group', 'SMB', 'Healthcare');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('NextGen Progression', 'NextGen Progression Partners', 'Enterprise', 'Real Estate');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Synergy Solutions', 'Synergy Solutions Consulting', 'SMB', 'Travel and Leisure');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Precision Progression', 'Precision Progression Group', 'Select', 'Healthcare');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Forward Foresight', 'Forward Foresight Ventures', 'Corporate', 'Media and Entertainment');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Fortitude Frontier', 'Fortitude Frontier Enterprises', 'Select', 'Manufacturing');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Redwood Resources', 'Redwood Resources LLC', 'Enterprise', 'Manufacturing');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Future Focus', 'Future Focus Firm LLC', 'Enterprise', 'Financial Services');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Beyond Boundaries', 'Beyond Boundaries Ventures', 'Corporate', 'Media and Entertainment');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Bright Bridge', 'Bright Bridge Consulting Co.', 'Enterprise', 'Financial Services');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Stellar Startups', 'Stellar Startups Group', 'Enterprise', 'Healthcare');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Catalystic Consulting', 'Catalystic Consulting Group', 'Select', 'Logistics');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Envision Endurance', 'Envision Endurance LLC', 'Corporate', 'Healthcare');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Elite Enterprises', 'Elite Enterprises Group', 'Corporate', 'Manufacturing');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Summit Solutions', 'Summit Solutions LLC', 'Enterprise', 'Financial Services');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Dynamic Development', 'Dynamic Development Group', 'SMB', 'Healthcare');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Proven Progression', 'Proven Progression LLC', 'SMB', 'Financial Services');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Bright Beginnings', 'Bright Beginnings Group', 'Select', 'Healthcare');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Quantum Quest', 'Quantum Quest Solutions', 'Select', 'Media and Entertainment');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Ignite Innovation', 'Ignite Innovation LLC', 'Select', 'Financial Services');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Thrive Together', 'Thrive Together LLC', 'Corporate', 'Healthcare');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Horizon Holdings', 'Horizon Holdings Group', 'Corporate', 'Travel and Leisure');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Optimum Outcomes', 'Optimum Outcomes Solutions', 'Select', 'Healthcare');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Fortitude Finance', 'Fortitude Finance Group', 'SMB', 'Logistics');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Bluebird Business', 'Bluebird Business Strategies', 'Enterprise', 'Financial Services');
INSERT INTO customers (label, name_canonical, segment, industry) VALUES ('Silver Summit', 'Silver Summit Group', 'Corporate', 'Healthcare');