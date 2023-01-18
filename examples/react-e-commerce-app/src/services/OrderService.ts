import altogic from '../libs/altogic';
import { Order, OrderItem, OrderStatus, PaginateData } from '../types/altogic';
import useAuthStore from '../store/auth';

export const ORDER_LIMIT = 10;
export default class OrderService {
	static async getAllOrders(page: number = 1, limit: number = ORDER_LIMIT) {
		const {
			// @ts-ignore
			data: { data, info },
			errors
		} = await altogic.db
			.model('orders')
			.lookup({ field: 'user' })
			.sort('createdAt', 'desc')
			.page(page)
			.limit(limit)
			.get(true);

		if (errors) throw errors;

		return {
			orders: data as Order[],
			paginateData: info as PaginateData
		};
	}
	static async getOrders(page: number = 1, limit: number = ORDER_LIMIT) {
		const { user } = useAuthStore.getState();
		if (!user) throw new Error('Unauthorized');

		const {
			// @ts-ignore
			data: { data, info },
			errors
		} = await altogic.db
			.model('orders')
			.filter(`user == '${user._id}'`)
			.sort('createdAt', 'desc')
			.page(page)
			.limit(limit)
			.get(true);

		if (errors) throw errors;

		return {
			orders: data as Order[],
			paginateData: info as PaginateData
		};
	}

	static async getOrderById(id: string) {
		const { data, errors } = await altogic.db.model('orders').object(id).get();

		if (errors) throw errors;

		return data as Order;
	}

	static async updateOrder(id: string, data: Partial<Order>) {
		const { data: order, errors } = await altogic.db.model('orders').object(id).update(data);
		if (errors) throw errors;
		return order as Order;
	}

	static async setTrackingURL(orderId: string, trackingURL: string) {
		const { data: order, errors } = await altogic.endpoint.put('/order/tracking-url/' + orderId, { trackingURL });
		if (errors) throw errors;

		return order as Order;
	}

	static async updateOrderStatus(orderId: string, status: OrderStatus) {
		const { data: order, errors } = await altogic.endpoint.put('/order/status/' + orderId, { status });
		if (errors) throw errors;

		return order as Order;
	}

	static async getStats() {
		return altogic.db.model('orders').group('status').compute({
			name: 'count',
			type: 'count'
		});
	}

	static async getTotalSalesByStatus(status: OrderStatus = 'completed') {
		return altogic.db
			.model('orders')
			.filter(`status == '${status}'`)
			.compute({ name: 'total', type: 'sum', expression: 'totalPrice' });
	}

	static async getOrderDetails(orderId: string) {
		const { data, errors } = await altogic.db
			.model('orderItems')
			.filter(`order._id == '${orderId}'`)
			.lookup({ field: 'product' })
			.lookup({ field: 'order' })
			.get();

		if (errors) throw errors;

		return data as OrderItem[];
	}

	static async getWaitingOrderCount() {
		const { data, errors } = await altogic.db
			.model('orders')
			.filter("status == 'waiting'")
			.compute({ name: 'count', type: 'count' });

		if (errors || !Array.isArray(data)) return 0;
		if (data.length === 0) return 0;
		return data[0].count as number;
	}

	static async searchOrder(query: string) {
		let filter = [`INCLUDES(user.email, '${query}')`, `INCLUDES(user.name, '${query}')`];

		if (!isNaN(Number(query))) {
			query = query.replace(/^0+/g, '');
			filter = [`INCLUDES(TOTEXT(orderNumber), '${query}')`];
		}

		const { data, errors } = await altogic.db
			.model('orders')
			.lookup({ field: 'user' })
			.filter(filter.join(' || '))
			.limit(100)
			.get();
		if (errors) throw errors;

		return data as Order[];
	}
}
