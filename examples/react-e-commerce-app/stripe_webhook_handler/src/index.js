const { createClient } = require('altogic');
const OrderService = require('./services/OrderService');
let altogic;

/**
 * @param req {typeof AltogicRequest}
 * @param res
 * @returns {Promise<void>}
 */
module.exports = async (req, res) => {
	const ENV_URL = 'https://e-commerce.c1-europe.altogic.com';
	const CLIENT_KEY = req.appParams.SERVERLESS_FUNCTION_CLIENT_KEY;

	if (!ENV_URL || !CLIENT_KEY) {
		return res.json(
			{
				code: 'missing-altogic-params',
				message:
					'Client library environment URL and/or client key variables are not set. Unless these variables are set, the cloud function cannot use Altogic Client Library.'
			},
			500
		);
	}

	altogic = createClient(ENV_URL, CLIENT_KEY);

	const userEmail = req.body.data.object.customer_email;
	const user = await getUserByEmail(altogic, userEmail);

	switch (req.body.type) {
		case 'checkout.session.completed': {
			await OrderService.completed(altogic, req, res, user);
			break;
		}

		default: {
			await res.json({ code: 'unknown-handler', message: 'Unknown requests cannot be handled' }, 500);
		}
	}
};

async function getUserByEmail(altogic, email) {
	const { data: user } = await altogic.db.model('users').filter(`email == '${email}'`).getSingle();
	return user;
}
