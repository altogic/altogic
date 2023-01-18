import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { PaginateData, Product } from '../types/altogic';

interface ProductState {
	products: Product[];
	paginateData: PaginateData;
	setProducts: (products: Product[], paginateData: PaginateData) => void;
	addProduct: (product: Product) => void;
	updateProduct: (product: Product) => void;
	removeProduct: (id: string) => void;
}

const useProductStore = create<ProductState>()(
	devtools(
		set => ({
			products: [],
			paginateData: {},
			setProducts(products, paginateData) {
				set({ products, paginateData });
			},
			addProduct(product) {
				set(prev => ({ products: [product, ...prev.products] }));
			},
			removeProduct(id) {
				set(prev => ({ products: prev.products.filter(product => product._id !== id) }));
			},
			updateProduct(product) {
				set(prev => {
					const products = prev.products.map(p => {
						if (p._id === product._id) p = product;
						return p;
					});
					return { products };
				});
			}
		}),
		{
			name: 'product-storage'
		}
	)
);

export default useProductStore;
