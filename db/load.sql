-- https://docs.google.com/spreadsheets/d/1KRMcZwiWMru0eDyv3I8N6lTwlCllkUkf5GSlYS02hJI/edit

DELETE FROM events WHERE true;
DELETE FROM workload_attributes WHERE true;
DELETE FROM _workloads WHERE true;
DELETE FROM customers WHERE true;


-- Customers
-- INSERT INTO customers(label, name, region, segment) VALUES
-- 	('acme', 'Acme Corp.', 'NORTHAM', 'Enterprise'),
-- 	('beta', 'Beta LLC', 'EMEA', 'Select')
-- ;

INSERT INTO customers (customer, name, label, region, segment) VALUES
	('a1b2c3d4-e5f6-4789-8a9b-c0d1e2f34567', 'Luminary Systems', 'luminary-systems', 'LATAM', 'Select'),
	('f8e7d6c5-b4a3-4982-910e-8f7c6d5b4a39', 'Cognito Tech', 'cognito-tech', 'JAPAC', 'Corporate'),
	('5c4d3b2a-10f9-4e8d-8c7b-6a5d4c3b2a10', 'Synergy Dynamics', 'synergy-dynamics', 'EMEA', 'Select'),
	('e9d8c7b6-a5f4-4d73-920b-7f6c5d4b3a29', 'NovaStream Solutions', 'novastream-solutions', 'NORTHAM', 'Enterprise'),
	('9b8a7c6d-5e4f-4362-810a-7e6c5d4b3a29', 'Apex Innovations', 'apex-innovations', 'NORTHAM', 'Enterprise'),
	('d7c6b5a4-f0e9-4c72-80f9-6e5d4c3b2a10', 'Zenith Core Technologies', 'zenith-core-technologies', 'NORTHAM', 'Corporate'),
	('2a1b0c9d-e8f7-4b6a-9f88-7d6c5e4f3a29', 'QuantumLeap Computing', 'quantumleap-computing', 'NORTHAM', 'Corporate'),
	('7c6d5b4a-3928-41f0-e0d9-c8b7a6958473', 'Veridian Networks', 'veridian-networks', 'JAPAC', 'Enterprise'),
	('b5a4f0e9-c72d-40f9-6e5d-4c3b2a109876', 'Elysian AI', 'elysian-ai', 'LATAM', 'Select'),
	('0c9d8e7f-6b5a-4987-312e-0f9c8d7b6a54', 'Phoenix Robotics', 'phoenix-robotics', 'NORTHAM', 'Enterprise')
;

-- Workloads
INSERT INTO _workloads (workload, customer, name, label) VALUES
	('b2894fa3-871a-4d9c-92e3-71f65c8a3d0b', '0c9d8e7f-6b5a-4987-312e-0f9c8d7b6a54', 'Nightingale', 'nightingale'),
	('e8a7c6d5-f4b3-4982-910e-8f7c6d5b4a39', 'e9d8c7b6-a5f4-4d73-920b-7f6c5d4b3a29', 'Chimera', 'chimera'),
	('a5d4c3b2-10f9-4e8d-8c7b-6a5d4c3b2a10', 'e9d8c7b6-a5f4-4d73-920b-7f6c5d4b3a29', 'Aether', 'aether'),
	('3c2d1f0e-9b8a-47c6-90fd-8e7d6c5b4a39', 'a1b2c3d4-e5f6-4789-8a9b-c0d1e2f34567', 'Titan', 'titan'),
	('f9e8d7c6-b5a4-4f0e-9c8d-7b6a5d4c3b2a', 'e9d8c7b6-a5f4-4d73-920b-7f6c5d4b3a29', 'Phoenix', 'phoenix'),
	('8a7c6d5b-4a39-4281-f0e9-d8c7b6a5f4d3', 'd7c6b5a4-f0e9-4c72-80f9-6e5d4c3b2a10', 'Nova', 'nova'),
	('1f0e9d8c-7b6a-45d4-c3b2-a10f9e8d7c6b', 'b5a4f0e9-c72d-40f9-6e5d-4c3b2a109876', 'Voyager', 'voyager'),
	('c6b5a4f0-e9d8-4c7b-6a5d-4c3b2a10f9e8', '0c9d8e7f-6b5a-4987-312e-0f9c8d7b6a54', 'Artemis', 'artemis'),
	('5b4a3928-1f0e-4d9c-8b7a-6958473f2c1d', 'f8e7d6c5-b4a3-4982-910e-8f7c6d5b4a39', 'Valhalla', 'valhalla'),
	('d8c7b6a5-f4d3-4b2a-10f9-e8d7c6b5a4f0', '7c6d5b4a-3928-41f0-e0d9-c8b7a6958473', 'Colossus', 'colossus'),
	('7b6a5d4c-3b2a-410f-9e8d-7c6b5a4f0e9d', 'b5a4f0e9-c72d-40f9-6e5d-4c3b2a109876', 'Seraph', 'seraph'),
	('a4f0e9d8-c7b6-4a5d-4c3b-2a10f9e8d7c6', '0c9d8e7f-6b5a-4987-312e-0f9c8d7b6a54', 'Hydra', 'hydra'),
	('281f0e9d-8c7b-46a5-d4c3-b2a10f9e8d7c', '7c6d5b4a-3928-41f0-e0d9-c8b7a6958473', 'Pandora', 'pandora'),
	('0e9d8c7b-6a5d-4c3b-2a10-f9e8d7c6b5a4', 'a1b2c3d4-e5f6-4789-8a9b-c0d1e2f34567', 'Elysium', 'elysium'),
	('9d8c7b6a-5d4c-3b2a-10f9-e8d7c6b5a4f0', '7c6d5b4a-3928-41f0-e0d9-c8b7a6958473', 'Chronos', 'chronos')
;


INSERT INTO workload_attributes (workload, stage, size) VALUES
	('b2894fa3-871a-4d9c-92e3-71f65c8a3d0b', 0, NULL),
	('e8a7c6d5-f4b3-4982-910e-8f7c6d5b4a39', 2, 280000),
	('a5d4c3b2-10f9-4e8d-8c7b-6a5d4c3b2a10', NULL, 400000),
	('3c2d1f0e-9b8a-47c6-90fd-8e7d6c5b4a39', 3, NULL),
	('f9e8d7c6-b5a4-4f0e-9c8d-7b6a5d4c3b2a', 3, 10000),
	('8a7c6d5b-4a39-4281-f0e9-d8c7b6a5f4d3', 3, NULL),
	('1f0e9d8c-7b6a-45d4-c3b2-a10f9e8d7c6b', 2, NULL),
	('c6b5a4f0-e9d8-4c7b-6a5d-4c3b2a10f9e8', 2, NULL),
	('5b4a3928-1f0e-4d9c-8b7a-6958473f2c1d', 2, 230000),
	('d8c7b6a5-f4d3-4b2a-10f9-e8d7c6b5a4f0', 1, NULL),
	('7b6a5d4c-3b2a-410f-9e8d-7c6b5a4f0e9d', 3, 310000),
	('a4f0e9d8-c7b6-4a5d-4c3b-2a10f9e8d7c6', 1, 460000),
	('281f0e9d-8c7b-46a5-d4c3-b2a10f9e8d7c', 3, NULL),
	('0e9d8c7b-6a5d-4c3b-2a10-f9e8d7c6b5a4', 2, 940000),
	('9d8c7b6a-5d4c-3b2a-10f9-e8d7c6b5a4f0', 0, 120000)
;

-- Events
INSERT INTO events (workload, outcome, happened_at) VALUES
	('f9e8d7c6-b5a4-4f0e-9c8d-7b6a5d4c3b2a', 'Kicked off the week with a promising discovery call with Isabelle Croft at Apex Innovations. They’re facing challenges with team collaboration and project management. SynergyOS could be the perfect solution!', now() - (trunc(random() * 5000) || ' hours')::interval),
	('f9e8d7c6-b5a4-4f0e-9c8d-7b6a5d4c3b2a', 'Sent over a personalized presentation showcasing how SynergyOS and its FlowSpace feature can revolutionize their workspace organization.', now() - (trunc(random() * 5000) || ' hours')::interval),
	('f9e8d7c6-b5a4-4f0e-9c8d-7b6a5d4c3b2a', 'Isabelle Croft seems intrigued by IdeaForge! Scheduled a follow-up to demonstrate how it fosters innovation and streamlines brainstorming sessions.', now() - (trunc(random() * 5000) || ' hours')::interval),
	('281f0e9d-8c7b-46a5-d4c3-b2a10f9e8d7c', 'The demo of IdeaForge went exceptionally well! Jasper Thorne loved the real-time collaborative editing and integrated mind-mapping tools.', now() - (trunc(random() * 5000) || ' hours')::interval),
	('e8a7c6d5-f4b3-4982-910e-8f7c6d5b4a39', 'Evelyn Vance expressed concerns about their current communication tools. Highlighted the benefits of ConnectHub’s secure file sharing and integrated task management.', now() - (trunc(random() * 5000) || ' hours')::interval),
	('281f0e9d-8c7b-46a5-d4c3-b2a10f9e8d7c', 'Shared a case study demonstrating how a similar company boosted productivity by 20% with SynergyOS.', now() - (trunc(random() * 5000) || ' hours')::interval),
	('3c2d1f0e-9b8a-47c6-90fd-8e7d6c5b4a39', 'Rhys Montgomery is particularly interested in Insight Analytics. They’re eager to gain data-driven insights into their team’s performance.', now() - (trunc(random() * 5000) || ' hours')::interval),
	('d8c7b6a5-f4d3-4b2a-10f9-e8d7c6b5a4f0', 'Prepared a customized demo focusing on Insight Analytics, showcasing its ability to track project progress and identify areas for improvement.', now() - (trunc(random() * 5000) || ' hours')::interval),
	('c6b5a4f0-e9d8-4c7b-6a5d-4c3b2a10f9e8', 'Evelyn Vance was blown away by the power of AutoPilot! They see huge potential in automating their repetitive tasks.', now() - (trunc(random() * 5000) || ' hours')::interval),
	('a4f0e9d8-c7b6-4a5d-4c3b-2a10f9e8d7c6', 'Addressing Rhys Montgomery’s questions about SynergyOS’s security features and integration with their existing systems.', now() - (trunc(random() * 5000) || ' hours')::interval),
	('281f0e9d-8c7b-46a5-d4c3-b2a10f9e8d7c', 'Sent over a tailored proposal outlining the specific benefits of SynergyOS for Jasper Thorne’s team.', now() - (trunc(random() * 5000) || ' hours')::interval),
	('c6b5a4f0-e9d8-4c7b-6a5d-4c3b2a10f9e8', 'Evelyn Vance is impressed with the proposal but wants to discuss pricing and potential customization options.', now() - (trunc(random() * 5000) || ' hours')::interval),
	('3c2d1f0e-9b8a-47c6-90fd-8e7d6c5b4a39', 'Had a productive negotiation with Rhys Montgomery. We’re close to finding a pricing structure that meets their budget.', now() - (trunc(random() * 5000) || ' hours')::interval),
	('d8c7b6a5-f4d3-4b2a-10f9-e8d7c6b5a4f0', 'Alistair Finch requested a trial period to experience SynergyOS firsthand.  Excited for them to see it in action!', now() - (trunc(random() * 5000) || ' hours')::interval),
	('1f0e9d8c-7b6a-45d4-c3b2-a10f9e8d7c6b', 'Provided Jun Nakamura with access to a trial version of SynergyOS and scheduled a training session to get them started.', now() - (trunc(random() * 5000) || ' hours')::interval),
	('3c2d1f0e-9b8a-47c6-90fd-8e7d6c5b4a39', 'Followed up with Rhys Montgomery after their initial experience with the SynergyOS trial.  The feedback is overwhelmingly positive!', now() - (trunc(random() * 5000) || ' hours')::interval),
	('c6b5a4f0-e9d8-4c7b-6a5d-4c3b2a10f9e8', 'Evelyn Vance loves FlowSpace! They’re amazed by how it adapts to their workflow and optimizes their workspace.', now() - (trunc(random() * 5000) || ' hours')::interval),
	('0e9d8c7b-6a5d-4c3b-2a10-f9e8d7c6b5a4', 'ConnectHub is a hit! Jun Nakamura’s team is already experiencing improved communication and streamlined collaboration.', now() - (trunc(random() * 5000) || ' hours')::interval),
	('7b6a5d4c-3b2a-410f-9e8d-7c6b5a4f0e9d', 'Evelyn Vance is leveraging Insight Analytics to identify bottlenecks and optimize their project timelines.', now() - (trunc(random() * 5000) || ' hours')::interval),
	('a5d4c3b2-10f9-4e8d-8c7b-6a5d4c3b2a10', 'Received enthusiastic feedback on AutoPilot. Alistair Finch’s team is saving valuable time by automating routine tasks.', now() - (trunc(random() * 5000) || ' hours')::interval),
	('a5d4c3b2-10f9-4e8d-8c7b-6a5d4c3b2a10', 'Alistair Finch is ready to move forward!  Preparing the final contract and reviewing the terms.', now() - (trunc(random() * 5000) || ' hours')::interval),
	('0e9d8c7b-6a5d-4c3b-2a10-f9e8d7c6b5a4', 'Contract sent to Jun Nakamura.  Confident we’ll have a signed deal soon!', now() - (trunc(random() * 5000) || ' hours')::interval),
	('a4f0e9d8-c7b6-4a5d-4c3b-2a10f9e8d7c6', 'Celebratory high-five! 🎉 Rhys Montgomery officially signed the contract.  Welcome to the SynergyOS family!', now() - (trunc(random() * 5000) || ' hours')::interval),
	('8a7c6d5b-4a39-4281-f0e9-d8c7b6a5f4d3', 'Kicked off the onboarding process with Seraphina Reid.  Their team is eager to fully implement SynergyOS.', now() - (trunc(random() * 5000) || ' hours')::interval),
	('281f0e9d-8c7b-46a5-d4c3-b2a10f9e8d7c', 'Providing ongoing support and training to ensure Jasper Thorne’s team maximizes the benefits of SynergyOS.', now() - (trunc(random() * 5000) || ' hours')::interval),
	('281f0e9d-8c7b-46a5-d4c3-b2a10f9e8d7c', 'Jasper Thorne is already seeing significant improvements in team productivity and project efficiency.', now() - (trunc(random() * 5000) || ' hours')::interval),
	('7b6a5d4c-3b2a-410f-9e8d-7c6b5a4f0e9d', 'ConnectHub is facilitating seamless communication and collaboration within Evelyn Vance’s team.', now() - (trunc(random() * 5000) || ' hours')::interval),
	('a5d4c3b2-10f9-4e8d-8c7b-6a5d4c3b2a10', 'IdeaForge is sparking creativity and driving innovation in their brainstorming sessions.', now() - (trunc(random() * 5000) || ' hours')::interval),
	('f9e8d7c6-b5a4-4f0e-9c8d-7b6a5d4c3b2a', 'Insight Analytics is providing valuable data that empowers Isabelle Croft to make informed decisions.', now() - (trunc(random() * 5000) || ' hours')::interval),
	('7b6a5d4c-3b2a-410f-9e8d-7c6b5a4f0e9d', 'AutoPilot is freeing up Evelyn Vance’s team to focus on high-value tasks and strategic initiatives.', now() - (trunc(random() * 5000) || ' hours')::interval),
	('5b4a3928-1f0e-4d9c-8b7a-6958473f2c1d', 'Seraphina Reid is thrilled with SynergyOS and has become a vocal advocate for our product.', now() - (trunc(random() * 5000) || ' hours')::interval),
	('1f0e9d8c-7b6a-45d4-c3b2-a10f9e8d7c6b', 'Received a glowing testimonial from Jun Nakamura highlighting the positive impact of SynergyOS on their business.', now() - (trunc(random() * 5000) || ' hours')::interval),
	('d8c7b6a5-f4d3-4b2a-10f9-e8d7c6b5a4f0', 'Alistair Finch expressed interest in exploring advanced features and potential upgrades.', now() - (trunc(random() * 5000) || ' hours')::interval),
	('d8c7b6a5-f4d3-4b2a-10f9-e8d7c6b5a4f0', 'Presented Alistair Finch with options for expanding their use of SynergyOS and maximizing its potential.', now() - (trunc(random() * 5000) || ' hours')::interval),
	('1f0e9d8c-7b6a-45d4-c3b2-a10f9e8d7c6b', 'Working on a customized solution to address Jun Nakamura’s evolving needs and long-term goals.', now() - (trunc(random() * 5000) || ' hours')::interval),
	('c6b5a4f0-e9d8-4c7b-6a5d-4c3b2a10f9e8', 'Evelyn Vance is impressed with our commitment to customer success and ongoing support.', now() - (trunc(random() * 5000) || ' hours')::interval),
	('0e9d8c7b-6a5d-4c3b-2a10-f9e8d7c6b5a4', 'Identified new opportunities to further enhance Jun Nakamura’s workflow and optimize their use of SynergyOS.', now() - (trunc(random() * 5000) || ' hours')::interval),
	('1f0e9d8c-7b6a-45d4-c3b2-a10f9e8d7c6b', 'Shared best practices and tips with Jun Nakamura’s team to help them become SynergyOS power users.', now() - (trunc(random() * 5000) || ' hours')::interval),
	('8a7c6d5b-4a39-4281-f0e9-d8c7b6a5f4d3', 'Seraphina Reid is experiencing the full potential of SynergyOS and achieving remarkable results.', now() - (trunc(random() * 5000) || ' hours')::interval),
	('9d8c7b6a-5d4c-3b2a-10f9-e8d7c6b5a4f0', 'Building a strong and lasting partnership with Jun Nakamura, ensuring their continued success with SynergyOS.', now() - (trunc(random() * 5000) || ' hours')::interval),
	('7b6a5d4c-3b2a-410f-9e8d-7c6b5a4f0e9d', 'Evelyn Vance referred us to another potential client in their industry!  The power of referrals in action.', now() - (trunc(random() * 5000) || ' hours')::interval),
	('b2894fa3-871a-4d9c-92e3-71f65c8a3d0b', 'Reached out to the referral from Ava Sterling and scheduled an introductory call.', now() - (trunc(random() * 5000) || ' hours')::interval),
	('0e9d8c7b-6a5d-4c3b-2a10-f9e8d7c6b5a4', 'The referral is facing similar challenges and seems like a great fit for SynergyOS.', now() - (trunc(random() * 5000) || ' hours')::interval),
	('a5d4c3b2-10f9-4e8d-8c7b-6a5d4c3b2a10', 'Preparing a personalized presentation for the referral, highlighting the specific benefits of SynergyOS for their business.', now() - (trunc(random() * 5000) || ' hours')::interval),
	('5b4a3928-1f0e-4d9c-8b7a-6958473f2c1d', 'Excited to begin a new sales cycle and help another organization transform their workspace with SynergyOS.', now() - (trunc(random() * 5000) || ' hours')::interval),
	('c6b5a4f0-e9d8-4c7b-6a5d-4c3b2a10f9e8', 'Reflecting on the successful implementation of SynergyOS at Evelyn Vance’s company.', now() - (trunc(random() * 5000) || ' hours')::interval),
	('8a7c6d5b-4a39-4281-f0e9-d8c7b6a5f4d3', 'Analyzing key learnings from this sales process to refine our strategies and improve future outcomes.', now() - (trunc(random() * 5000) || ' hours')::interval),
	('9d8c7b6a-5d4c-3b2a-10f9-e8d7c6b5a4f0', 'Sharing success stories and best practices with the sales team to inspire and motivate everyone.', now() - (trunc(random() * 5000) || ' hours')::interval),
	('7b6a5d4c-3b2a-410f-9e8d-7c6b5a4f0e9d', 'Continuously seeking ways to enhance SynergyOS and provide even greater value to our clients.', now() - (trunc(random() * 5000) || ' hours')::interval),
	('5b4a3928-1f0e-4d9c-8b7a-6958473f2c1d', 'Looking forward to the future of SynergyOS and its potential to revolutionize the way teams work together.', now() - (trunc(random() * 5000) || ' hours')::interval)
;

/*
SELECT
	customers.label, workloads.label, events.*
FROM events
INNER JOIN workloads USING(workload)
INNER JOIN customers USING(customer)
ORDER BY events.happened_at DESC
;
*/
