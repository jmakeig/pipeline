/* https://www.totaltypescript.com/how-to-test-your-types */

/**
 * Allows any property to be `null.
 *
 * @see https://stackoverflow.com/a/77236776/563324
 */
type Nullable<T> = {
	[P in keyof T]: T[P] | null;
};

/**
 * Excludes (optional and `never`) properties from `T` that extend the type `V`.
 *
 * @see https://stackoverflow.com/a/57386444/563324
 */
type ExcludeMatch<T, V> = Pick<T, { [K in keyof T]-?: T[K] extends V ? never : K }[keyof T]>;

/**
 * Replaces properties matching a type with a “looser” type, defaulting to `string`.
 * This is useful to allow potentially invalid inputs from the frontend before validation.
 *
 * @example
 * // Allows strings for properties of type Segment or Region
 * Loosen<Customer, Segment | Region, string>
 */
type Loosen<T, Match, Replace = string> = {
	[P in keyof T]: T[P] extends NonNullable<Match>
		? Replace
		: T[P] extends Match | null
			? Replace | null
			: T[P];
};

/**
 * TypeScript doesn’t support nominal types. This is a hack to provide matching on this specifc type,
 *  not just `string`, in a conditional epxression in a mapped type.
 */
type ID = string & { readonly __brand: unique symbol };
type ISODate = string;

export type Region = 'NORTHAM' | 'EMEA' | 'JAPAC' | 'LATAM';
export type Segment = 'Select' | 'Enterprise' | 'Corporate' | 'SMB';
export type SalesStage = {
	stage: 0 | 1 | 2 | 3 | 4 | 5 | 97 | 98 | 99 | 100;
	name: string;
};
export type Participant = string;

type CustomerData = {
	customer: ID;
	name: string;
	label: string;
	region: Region | null;
	segment: Segment | null;
};

export type CustomerNew = Nullable<Loosen<ExcludeMatch<CustomerData, ID>, Segment | Region>>;
export type Customer = CustomerData & {
	workloads: Array<Omit<Workload, 'customer'>>;
	events: Array<Omit<Event, 'customer'>>;
};

export type WorkloadAttributes = {
	attribute: ID;
	stage: SalesStage['stage'];
	size: number;
	engagement_lead: Participant;
	updated_at: ISODate;
};

/** Inidicator that an attribute has been deleted. `null` means “no change”.  */
type DeleteSignal = symbol;

export type WorkloadAttributeAction = {
	stage: WorkloadAttributes['stage'] | DeleteSignal | null;
	size: WorkloadAttributes['size'] | DeleteSignal | null;
	engagement_lead: WorkloadAttributes['engagement_lead'] | DeleteSignal | null;
};
export type WorkloadData = {
	workload: ID;
	name: string;
	label: string;
	customer: CustomerData['customer'];
} & Nullable<Omit<WorkloadAttributes, 'attribute' | 'updated_at'>>;

export type WorkloadNew = Nullable<WorkloadData>;
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
export type EventNew = Nullable<EventData>;
export type Event =
	| (Omit<EventW, 'workload'> & { workload: Omit<Workload, 'events'> })
	| (Omit<EventC, 'customer'> & { customer: Omit<Customer, 'events'> });

type Locale = 'en-US';
type Message =
	| string
	| {
			[key in Locale]: string;
	  };
export type Validation<Entity = any> = {
	for?: keyof Entity; // Is this too strict? What about properties like `'children[2]'`?
	message: Message;
};

/**
 * The return type of an API call. For invalid results, it reflects back what was passed in (`In`) as `input`
 * along with a `validations` property, listing the validation assertions.
 * If the result is valid it returns the entity (`Out`).
 * Make sure your entity (`Out`) doesn’t have a `validations` property itself. See `is_valid()`.
 */
type Result<In, Out> = Out | InvalidResult<In, Out>;

type InvalidResult<In, Out> = {
	validations: Array<Validation<Out>>;
	input: In; // Is there a way to parameterize the name?
};

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
