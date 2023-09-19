/** @type {import('./$types').Actions} */
export const actions = {
	async default({ request }) {
		const stub = to_customer_stub(await request.formData());
	}
};

/**
 *
 * @param {FormData} formData
 * @returns {import('$lib/entities').Customer_Stub}
 */
function to_customer_stub(formData) {
	return {
		// @ts-ignore
		label: formData.get('label'),
		// @ts-ignore
		name_canonical: formData.get('description')
	};
}
