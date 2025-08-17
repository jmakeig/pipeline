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
 * Like `Pick`, but matches on property type rather than key name.
 *
 * @example
 * PickMatch<{name: string, lucky_numbers: Array<number>}, Array<any>> // type { lucky_numbers: Array<number> }
 */
type PickMatch<Type, Union> = {
	[P in keyof Type as Type[P] extends Union ? P : never]: Type[P];
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
 * Require at least one of the properties of `T`.
 * This is especially useful for `Record` types.
 */
type AtLeastOne<T> = {
	[K in keyof T]-?: Pick<T, K> & Partial<T>;
}[keyof T];

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

type Locale = 'en-US' | 'fr';
/**
 * Allows you to reference any key of `Entity` by name,
 * as well as an optional offset for `Array` properties.
 *
 * @example
 * Forable<{a: string; b: Array<number>}> // 'a' | 'b' | 'b[#]', where # is any number
 */
type Forable<Entity> =
	| `${string & keyof Entity}`
	| `${string & keyof PickMatch<Entity, Array<unknown>>}[${number}]`;
/**
 * A validation message. Typical usage is for communicating business rule violations
 * back to users. `for` can optionally reference a property in the entity being validated by name,
 * e.g. `'id'` or `'workloads[3]'`.
 */
export type Validation<T = unknown> = {
	message: string | AtLeastOne<{ [K in Locale]: string }>;
	for?: Forable<T>;
};

/**
 * A response to an API call. A response can either be the plain output entity, `Out`,
 * or a validation error wrapper around the input, `In`, plus a collection of `Validation`
 * instances. `Prop` allows you to
 * name the property on the `InvalidResult` instance to access the input entity,
 * e.g. `result.customer` versus the default, `result.input`.
 *
 * This means that APIs should *not* throw `Error`s for business rule violations.
 * Validation is an expected part of the API contract and thus is modeled in the
 * responses from API calls. Thrown errors should represent exceptional circumstances.
 */
export type Result<In, Out, Prop extends string = 'input'> = Out | InvalidResult<In, Out, Prop>;

/**
 * A way to communicate a business rule violation in an API call.
 */
export type InvalidResult<In, Out, Prop extends string = 'input'> = {
	validations: Array<Validation<Out>>;
} & {
	[property in Prop]: In;
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
