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

// export const DELETE: unique symbol = Symbol.for('DELETE');

export type SalesStage = {
	stage: 0 | 1 | 2 | 3 | 4 | 5 | 97 | 98 | 99 | 100;
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

export type User = string;
