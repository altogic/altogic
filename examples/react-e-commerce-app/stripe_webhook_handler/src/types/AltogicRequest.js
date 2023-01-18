const exampleJson = {
	id: 'evt_1MI5ETG2RiuGq8HDpIyMEZpE',
	data: {
		object: {
			id: 'cs_test_a1L9dr6A3JIZOESRzm50t4PuNKbT0ihyQsGRVP835ILCRdUVtNZVics3im',
			object: 'checkout.session',
			amount_subtotal: 153695,
			amount_total: 153695,
			cancel_url: 'http://localhost:5173/cancel',
			currency: 'usd',
			custom_text: {
				shipping_address: null,
				submit: null
			},
			customer_details: {
				address: {
					city: null,
					country: 'TR',
					line1: null,
					line2: null,
					postal_code: null,
					state: null
				},
				email: 'ozgurozalp1999@gmail.com',
				name: 'Özgür ÖZALP',
				phone: null,
				tax_exempt: 'none',
				tax_ids: []
			},
			customer_email: 'ozgurozalp1999@gmail.com',
			expires_at: 1671865156,
			metadata: {
				product_1_altogic_id: '63a438d9a432b505611cc0a1'
			},
			mode: 'payment',
			payment_intent: 'pi_3MI5ERG2RiuGq8HD0pJuWFfv',
			status: 'complete',
			success_url: 'http://localhost:5173/success'
		}
	},
	request: {
		id: null,
		idempotency_key: null
	},
	type: 'checkout.session.completed'
};

const AltogicRequest = {
	body: exampleJson,
	appParams: {
		SERVERLESS_FUNCTION_CLIENT_KEY: ''
	}
};

module.exports = { AltogicRequest };
