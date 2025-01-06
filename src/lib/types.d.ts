/* https://www.totaltypescript.com/how-to-test-your-types */

/* https://stackoverflow.com/a/77236776/563324 */
type PartialNullable<T> = {
	[P in keyof T]?: T[P] | null; // Is this too loose? I think it should require the properties, but just allow nulls as values.
};

type ID = string; // UUID
type ISODate = string;

type Region = 'NORTHAM' | 'EMEA' | 'JAPAC' | 'LATAM';
type Segment = 'Select' | 'Enterprise' | 'Corporate' | 'SMB';
export type SalesStage = {
	stage: 0 | 1 | 2 | 3 | 4 | 5 | 97 | 98 | 99 | 100;
	name: string;
};

export type CustomerData = {
	customer: ID;
	name: string;
	label: string;
	region?: Region;
	segment?: Segment;
};
export type CustomerNew = PartialNullable<CustomerData>;
export type Customer = CustomerData & {
	workloads: Array<Omit<Workload, 'customer'>>;
	events: Array<Omit<Event, 'customer'>>;
};

export type WorkloadAttributes = {
	attribute: ID;
	stage: SalesStage['stage'];
	size: number;
	engagement_lead: Participant;
	updated_at: ISODate; // ISODate
};
export type WorkloadAttributeAction = {
	stage?: WorkloadAttributes['stage'] | symbol;
	size?: WorkloadAttributes['size'] | symbol;
	engagement_lead?: WorkloadAttributes['engagement_lead'] | symbol;
};
export type WorkloadData = {
	workload: ID;
	name: string;
	label: string;
	customer: CustomerData['customer'];
} & PartialNullable<Omit<WorkloadAttributes, 'attribute' | 'updated_at'>>;

export type WorkloadNew = PartialNullable<WorkloadData>;
export type Workload = Omit<WorkloadData, 'customer' | 'stage'> & {
	customer: Omit<Customer, 'workloads'>;
	stage?: SalesStage;
	last_touched: ISODate;
	events: Array<Omit<Event, 'workload'>>;
};

export type EventData = {
	event: ID;
	workload?: WorkloadData['workload'];
	customer?: CustomerData['customer'];
	outcome: string;
	happened_at: ISODate;
	team_participants?: Array<Participant>;
	field_participants?: Array<Participant>;
};
type EventW = Omit<EventData, 'workload' | 'customer'> & {
	workload: WorkloadData['workload'];
	customer?: never;
};
type EventC = Omit<EventData, 'workload' | 'customer'> & {
	workload?: never;
	customer: CustomerData['customer'];
};
export type EventBase = EventW | EventC;
export type EventNew = PartialNullable<EventData>;
export type Event =
	| (Omit<EventW, 'workload'> & { workload: Omit<Workload, 'events'> })
	| (Omit<EventC, 'customer'> & { customer: Omit<Customer, 'events'> });

export type Validation = {
	for?: string;
	message: string;
};

export type Participant = string;

/*
const c: Customer = {
	customer: 'customer',
	name: 'name',
	label: 'label',
	workloads: [
		{
			workload: 'workload',
			name: 'name',
			label: 'label',
			last_touched: new Date(),
			events: [{ event: 'event', outcome: 'outcome', happened_at: new Date() }]
		}
	],
	events: [{ event: 'event', outcome: 'outcome', happened_at: new Date() }]
};

const w: Workload = {
	workload: 'workload',
	name: 'name',
	label: 'label',
	size: 1000,
	stage: { stage: 0, name: 'name' },
	customer: c,
	last_touched: new Date(),
	events: [
		{
			event: 'event',
			outcome: 'outcome',
			happened_at: new Date()
		}
	]
};
*/
