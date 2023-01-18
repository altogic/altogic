import { useLoaderData } from 'react-router-dom';
import ProductList from '../components/ProductList';
import { PaginateData, Product } from '../types/altogic';
import { Player } from '@lottiefiles/react-lottie-player';

interface CategoryLoader {
	items: Product[];
	paginateData: PaginateData;
}

export default function Category() {
	const { items, paginateData } = useLoaderData() as CategoryLoader;

	const noProductsInfoMessage = (
		<div className="text-center p-4 text-xl">
			<Player autoplay loop src="/no-product.json" style={{ height: '300px', width: '300px' }} />
			<p>No products found in this category</p>
		</div>
	);
	return (
		<ProductList
			noProductsInfoMessage={noProductsInfoMessage}
			products={items}
			paginateData={paginateData}
			categoryPage
		/>
	);
}
