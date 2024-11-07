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

export type Workload = {
	workload: ID;
	name: string;
	label: string;
	customer: Customer | Customer['customer'];
	stage: number?;
};
export type WorkloadNew = Omit<Workload, 'workload'>;
export type WorkloadDeep = Workload & {
	stage: {
		stage: number;
		name: string;
	};
	last_touched: Date;
	events: Array<Event>;
};

export type Event = {
	event: ID;
	customer: Customer | Customer['customer'];
	workload: Workload | Workload['workload'];
	outcome: string;
	happened_at: Date;
};
export type EventDeep = Event & {
	customer: Customer;
	workload: Workload;
};
