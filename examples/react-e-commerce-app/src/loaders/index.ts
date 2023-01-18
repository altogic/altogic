import ProductService, { PRODUCT_LIMIT } from '../services/ProductService';
import CategoryService from '../services/CategoryService';
import CartService from '../services/CartService';
import useAuthStore from '../store/auth';
import { Cart, Category, Color, PaginateData, Product, Size, User } from '../types/altogic';
import altogic from '../libs/altogic';
import { ColorService, OrderService, SizeService } from '../services';

export async function rootLoader() {
	const searchParams = new URLSearchParams(location.search);
	const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
	const products = ProductService.getProducts({ onlyHasStock: true, page, limit: PRODUCT_LIMIT });
	const activeCategories = CategoryService.getActiveCategories();
	const categories = CategoryService.getCategories();
	const colors = ColorService.getColors();
	const sizes = SizeService.getSizes();

	const data: RootLoader = {
		products: await products,
		categories: await categories,
		activeCategories: await activeCategories,
		colors: await colors,
		sizes: await sizes,
		cart: []
	};
	const { user, logout, setUser } = useAuthStore.getState();
	if (user) {
		data.cart = await CartService.getCart();
		const { user: userFromDB, errors } = await altogic.auth.getUserFromDB();
		if (!userFromDB || errors) logout();
		setUser(userFromDB as User);
		if (user.isAdmin) {
			altogic.endpoint.post('/add-access-group').then(({ data }) => useAuthStore.getState().setSession(data));
		}
	}

	return data;
}

export async function orderDetailLoader(orderId?: string) {
	if (!orderId) return;
	const orderDetails = await OrderService.getOrderDetails(orderId);
	if (orderDetails.length === 0) throw new Response('Not Found', { status: 404 });
	return orderDetails;
}

export async function productDetailLoader(productId?: string) {
	if (!productId) return;
	const product = await ProductService.getProductById(productId);
	if (!product) throw new Response('Not Found', { status: 404 });

	const variants = await ProductService.getProductsByVariantId(product.variantId);

	return { product, variants };
}
export async function productDetailLoaderForEdit(productId?: string) {
	if (!productId) return;
	const product = await ProductService.getProductById(productId);
	if (!product) throw new Response('Not Found', { status: 404 });
	return product;
}
export async function getProductByCategoryLoader(slug?: string, page?: number) {
	if (!slug) return;

	return await ProductService.getProductsByCategory(slug, {
		onlyHasStock: true,
		page: page ?? 1,
		limit: PRODUCT_LIMIT
	});
}
export async function getWaitingOrderCountLoader() {
	return OrderService.getWaitingOrderCount();
}

export async function statsLoader() {
	const { data: completedSales, errors: completedSalesErrors } = await OrderService.getTotalSalesByStatus(
		'completed'
	);
	const { data: stats, errors: statsErrors } = await OrderService.getStats();

	if (completedSalesErrors || statsErrors) return { completedSales: 0, stats: {} };

	return {
		// @ts-ignore
		totalSales: completedSales[0]?.total ?? 0.0,
		// @ts-ignore
		orderStats: stats?.reduce((acc, curr) => {
			acc[curr.groupby.group] = curr.count;
			return acc;
		}, {})
	};
}

export interface RootLoader {
	products: {
		items: Product[];
		paginateData: PaginateData;
	};
	categories: Category[];
	activeCategories: Category[];
	colors: Color[];
	cart: Cart[];
	sizes: Size[];
}
