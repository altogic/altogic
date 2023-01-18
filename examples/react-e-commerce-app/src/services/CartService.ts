import altogic from '../libs/altogic';
import { Cart } from '../types/altogic';
import useAuthStore from '../store/auth';

export default class CartService {
	static async getCart() {
		const user = useAuthStore.getState().user;
		if (!user) throw new Error('Unauthorized');

		const { data, errors } = await altogic.db
			.model('cart')
			.filter(`user._id == '${user._id}'`)
			.lookup({ field: 'user' })
			.lookup({ field: 'product' })
			.get();

		if (errors) throw errors;

		return data as Cart[];
	}

	static async addToCart(data: any) {
		const { data: dataFromDB, errors } = await altogic.endpoint.post('/cart', data);
		if (errors) throw errors;

		return dataFromDB as Cart;
	}

	static async removeCartItem(id: string) {
		const { errors } = await altogic.db.model('cart').object(id).delete();
		if (errors) throw errors;

		return true;
	}

	static async removeCartItemByProductId(productId: string) {
		const user = useAuthStore.getState().user;
		if (!user) throw new Error('Unauthorized');
		const { errors } = await altogic.db.model('cart').filter(`product == '${productId}'`).delete();
		if (errors) throw errors;

		altogic.realtime.send(user._id, 'fetch-cart', true);

		return true;
	}

	static async clearCart() {
		const user = useAuthStore.getState().user;
		if (!user) throw new Error('Unauthorized');
		const { errors } = await altogic.db.model('cart').filter(`user == '${user._id}'`).delete();
		if (errors) throw errors;
		altogic.realtime.send(user._id, 'cleared-cart', true);
		return true;
	}
}
