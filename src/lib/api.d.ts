import { Customer, Event } from '$lib/entities';

export type LookupList = { value: string; label: string }[];

export interface API {
	list_customers: () => Promise<Customer[]>;
	list_events: () => Promise<Event[]>;
	lookup_customers: (by?: string) => Promise<LookupList>;
	lookup_workloads: (by?: string) => Promise<LookupList>;
	/*
	find_workout: (name: string) => Promise<Workout>;
	update_workout: (workout: Workout) => Promise<Workout>;
	create_workout: (workout: WorkoutStub) => Promise<Workout>;
	delete_workout: (name: string) => Promise<>;
	*/
	// validate_workout: (item: Item) => Promise<Validation[]>;
	// close: () => void;
}
