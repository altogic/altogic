import type { User as AltogicUser } from 'altogic';

export interface User extends AltogicUser {
	isAdmin: boolean;
	createdAt: string;
	updatedAt: string;
	phone: string;
	address?: Address;
}
export interface Address {
	country: string;
	city: string;
	detailedAddress: string;
	zipCode: string;
	_parent?: string;
	_id?: string;
}
export interface Category {
	_id: string;
	name: string;
	slug: string;
	createdAt: string;
	updatedAt: string;
	productCount?: number;
}
export interface Product {
	_id: string;
	name: string;
	price: number;
	description: string;
	category: Category;
	size?: Size;
	color?: Color;
	variantId: string;
	coverURL: string;
	qtyInStock: number;
	stripePriceId: string;
	stripeProductId: string;
	createdAt: string;
	updatedAt: string;
}

export type OrderStatus = 'waiting' | 'preparing' | 'shipped' | 'completed' | 'canceled';

export interface Order {
	_id: string;
	trackingURL?: string;
	orderNumber: number;
	status: OrderStatus;
	totalPrice: number;
	stripeCheckoutId: string;
	user: User;
	createdAt: string;
	updatedAt: string;
}

export interface OrderItem {
	_id: string;
	productName: string;
	quantity: number;
	price: number;
	order: Order;
	user: User;
	product: Product;
	createdAt: string;
	updatedAt: string;
}

export interface Cart {
	_id: string;
	user: User;
	product: Product;
	quantity: number;
	createdAt: string;
	updatedAt: string;
}

export interface Color {
	_id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
}

export interface Size {
	_id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
}

export interface PaginateData {
	count?: number;
	currentPage?: number;
	pageSize?: number;
	totalPages?: number;
}
