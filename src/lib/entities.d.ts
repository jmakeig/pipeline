export interface Customer {
	/**  */
	customer_id: string;
	/**  */
	label: string;
	/**  */
	name_canonical: string;
	/** */
	vector_id?: string;
	/** */
	segment?: string;
	/** */
	industry?: string;
}

export interface Customer_Stub extends Omit<Customer, 'customer_id'> {}

/** */
export interface Event {
	/** */
	event_id: string;
	/** */
	customer_id: string;
	/** */
	workload_id: string;
	/** */
	timestamp: Date;
}