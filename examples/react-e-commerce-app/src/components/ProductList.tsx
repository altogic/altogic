import ProductCard from './ProductCard';
import useProductStore from '../store/product';
import { PaginateData, Product } from '../types/altogic';
import { useParams, useSearchParams } from 'react-router-dom';
import { ProductService } from '../services';
import { PRODUCT_LIMIT } from '../services/ProductService';
import Pagination from './Pagination';

interface ProductListProps {
	products?: Product[];
	noProductsInfoMessage?: JSX.Element | string;
	categoryPage?: boolean;
	paginateData?: PaginateData;
}

export default function ProductList({
	products,
	noProductsInfoMessage,
	paginateData,
	categoryPage = false
}: ProductListProps) {
	const { products: productsFromStore, paginateData: paginateDataFromStore, setProducts } = useProductStore();
	const _products = products ?? productsFromStore;
	const _paginateData = paginateData ?? paginateDataFromStore;
	const [searchParams] = useSearchParams();
	const { slug } = useParams();

	async function getPaginateProducts() {
		const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;

		const { items, paginateData } =
			categoryPage && slug
				? await ProductService.getProductsByCategory(slug, {
						onlyHasStock: true,
						page,
						limit: PRODUCT_LIMIT
				  })
				: await ProductService.getProducts({
						onlyHasStock: true,
						page,
						limit: PRODUCT_LIMIT
				  });
		setProducts(items, paginateData);
	}

	return (
		<section className="container mx-auto px-4">
			{_products.length === 0 ? (
				noProductsInfoMessage ?? (
					<div className="p-2 text-center text-2xl">
						SORRY!
						<br />
						We don't have any products yet.
					</div>
				)
			) : (
				<div className="pb-10 space-y-4">
					<div className="mt-6 grid grid-cols-2 gap-y-6 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
						{_products.map(product => (
							<ProductCard key={product._id} product={product} />
						))}
					</div>
					<Pagination onPageChange={getPaginateProducts} paginateData={_paginateData} />
				</div>
			)}
		</section>
	);
}
