const sendOrderConfirmationEmail = require('../helpers/sendOrderConfirmationEmail');
const sendOrderNotificationToAdmins = require('../helpers/sendOrderNotificationToAdmins');

class OrderService {
	static async completed(altogic, req, res, user) {
		const { data: paymentCheck, errors: checkingError } = await altogic.db
			.model('orders')
			.filter(`stripeCheckoutId == '${req.body.data.object.payment_intent}'`)
			.getSingle();

		if (checkingError) {
			return res.json(checkingError, checkingError.status);
		}

		if (paymentCheck) {
			return res.json({ message: 'The order has already been processed' }, 500);
		}

		const { errors: cartDeleteError } = await altogic.db.model('cart').filter(`user == '${user._id}'`).delete();

		if (!cartDeleteError) {
			altogic.realtime.send(user._id, 'cleared-cart', true);
		} else {
			console.warn(cartDeleteError);
		}

		const data = {
			totalPrice: req.body.data.object.amount_total / 100,
			status: 'waiting',
			stripeCheckoutId: req.body.data.object.payment_intent,
			...(user && { user: user._id })
		};

		const { data: order, errors } = await altogic.db.model('orders').create(data);
		const orderItemIds = Object.values(req.body.data.object.metadata).filter(Boolean);
		const orderItemsFilter = orderItemIds.map(item => `_id == '${item.split('-')[0]}'`).join(' || ');

		if (errors) {
			return res.json(errors, errors.status);
		}

		const { errors: orderItemsErrors } = await altogic.db.model('orderItems').filter(orderItemsFilter).update({
			order: order._id
		});

		for (let orderItemId of orderItemIds) {
			const [_, quantity, productId] = orderItemId.split('-');
			const { errors } = await altogic.db
				.model('products')
				.object(productId)
				.updateFields({
					field: 'qtyInStock',
					updateType: 'decrement',
					value: Number(quantity)
				});
			if (errors) console.warn(errors);
		}

		if (orderItemsErrors) {
			return res.json(orderItemsErrors, orderItemsErrors.status);
		}
		altogic.realtime.send('admin', 'waiting-order-count', true);
		altogic.realtime.close();

		sendOrderConfirmationEmail(altogic, user, order._id, data.totalPrice).catch(console.error);
		sendOrderNotificationToAdmins(altogic).catch(console.error);
		await res.json({ message: 'ok' }, 201);
	}
}

module.exports = OrderService;
