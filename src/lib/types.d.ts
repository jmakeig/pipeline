type ID = string; // UUID

export type Customer = {
	customer: ID;
	name: string;
	label: string;
	region: 'NORTHAM' | 'EMEA' | 'JAPAC' | 'LATAM' | undefined;
	segment: 'Select' | 'Enterprise' | 'Corporate' | 'SMB' | undefined;
};
export type CustomerNew = Omit<Customer, 'customer'>;
export type CustomerDeep = Customer & {
	workloads: Array<WorkloadDeep>;
	events: Array<Event>;
};

export type SalesStage = {
	stage: number;
	name: string;
};

export type Workload = {
	workload: ID;
	name: string;
	label: string;
	customer: Customer; // | Customer['customer'];
	stage?: SalesStage;
	size?: number;
	engagement_lead?: Participant;
};
export type WorkloadNew = Omit<Workload, 'workload'>;
export type WorkloadDeep = Workload & {
	last_touched: Date;
	events: Array<Event>;
};

export type Participant = string;

export type Event = {
	event: ID;
	customer?: Customer; //| Customer['customer'];
	workload?: Workload; //| Workload['workload'];
	outcome: string;
	happened_at: Date;
};
// Lite version with ID foreign keys and optional defaults
export type EventNew = {
	event?: ID;
	workload?: ID;
	customer?: ID;
	outcome: string;
	happened_at?: Date;
};

export type Validation = {
	for?: string;
	message: string;
};
