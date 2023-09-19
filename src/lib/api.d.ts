import { Customer, Customer_Stub } from '$lib/entities';

export interface API {
	list_customers: () => Promise<Customer[]>;
	/*
	find_workout: (name: string) => Promise<Workout>;
	update_workout: (workout: Workout) => Promise<Workout>;
	create_workout: (workout: WorkoutStub) => Promise<Workout>;
	delete_workout: (name: string) => Promise<>;
	*/
	// validate_workout: (item: Item) => Promise<Validation[]>;
	// close: () => void;
}