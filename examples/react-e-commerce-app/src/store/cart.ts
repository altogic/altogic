import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { Cart } from '../types/altogic';

interface CartState {
	items: Cart[];
	totalAmount: number;
	addToCart: (cartItem: Cart) => void;
	removeProduct: (item: Cart) => void;
	setCart: (items: Cart[]) => void;
}

const useCartStore = create<CartState>()(
	devtools(
		set => ({
			items: [],
			totalAmount: 0,
			addToCart(cartItem) {
				set(prev => {
					let items;
					const exist = prev.items.find(item => item.product?._id === cartItem?.product._id);
					if (exist) {
						items = prev.items.map(item => {
							if (item.product._id === cartItem.product._id) {
								item = cartItem;
							}
							return item;
						});
					} else {
						items = [...prev.items, cartItem];
					}
					set({ totalAmount: calculateTotalPrice(items) });
					return { items };
				});
			},
			removeProduct(item) {
				set(prev => {
					const items = prev.items.filter(_item => _item._id !== item._id);
					set({ totalAmount: calculateTotalPrice(items) });
					return {
						items
					};
				});
			},
			setCart(items) {
				set({ items, totalAmount: calculateTotalPrice(items) });
			}
		}),
		{
			name: 'cart-storage'
		}
	)
);

function calculateTotalPrice(items: Cart[]) {
	return items.reduce((acc, curr) => {
		acc += curr.quantity * curr.product?.price;
		return acc;
	}, 0);
}

export default useCartStore;
