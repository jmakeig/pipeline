DELETE FROM sales_stages WHERE true;

-- Sales Stages
INSERT INTO sales_stages(stage, name) VALUES
	(0, 'Qualify'),
	(1, 'Refine'),
	(2, 'Tech Eval/Solution Dev'),
	(3, 'Proposal Negotiation'),
	(4, 'Migration/Implementation'),
	(5, 'Live/Production'),
	(97, 'Qualified Out'),
	(98, 'Stalled'),
	(99, 'Lost'),
	(100, 'Closed')
;
