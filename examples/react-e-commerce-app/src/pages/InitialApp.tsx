import { Outlet, useLoaderData, useRevalidator } from 'react-router-dom';
import { useEffect } from 'react';
import altogic from '../libs/altogic';
import { CartService, OrderService } from '../services';
import { RootLoader } from '../loaders';
import {
	useColorStore,
	useCategoryStore,
	useAuthStore,
	useProductStore,
	useCartStore,
	useSizeStore,
	useAdminStore
} from '../store';
import { toast } from 'react-toastify';

export default function InitialApp() {
	const { revalidate } = useRevalidator();
	const { products, categories, cart, activeCategories, colors, sizes } = useLoaderData() as RootLoader;
	const { setProducts } = useProductStore();
	const { setCategories, setActiveCategories } = useCategoryStore();
	const { setCart } = useCartStore();
	const { user } = useAuthStore();
	const { setColors } = useColorStore();
	const { setSizes } = useSizeStore();
	const { setWaitingOrderCount } = useAdminStore();

	useEffect(() => {
		setProducts(products.items, products.paginateData);
		setCategories(categories);
		setActiveCategories(activeCategories);
		setColors(colors);
		setSizes(sizes);
		if (cart) setCart(cart);

		if (user) {
			altogic.realtime.join(user?._id);
			if (user.isAdmin) altogic.realtime.join('admin');

			altogic.realtime.on('cleared-cart', clearCart);
			altogic.realtime.on('fetch-cart', fetchCart);
			altogic.realtime.on('waiting-order-count', fetchWaitingOrderCount);
		}

		return () => {
			altogic.realtime.off('cleared-cart', clearCart);
			altogic.realtime.off('fetch-cart', fetchCart);
			altogic.realtime.off('waiting-order-count', fetchWaitingOrderCount);
		};
	}, []);

	function clearCart() {
		setCart([]);
	}

	async function fetchCart() {
		setCart(await CartService.getCart());
	}

	async function fetchWaitingOrderCount({ message }: { message: boolean }) {
		if (message) toast.info("You've got new order");
		revalidate();
		setWaitingOrderCount(await OrderService.getWaitingOrderCount());
	}

	return <Outlet />;
}
