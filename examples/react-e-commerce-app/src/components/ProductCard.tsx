import { Link } from 'react-router-dom';
import { Product } from '../types/altogic';
import { moneyFormat } from '../helpers';

interface ProductProps {
	product: Product;
}
export default function ProductCard({ product }: ProductProps) {
	return (
		<div key={product._id} className="group gap-2 flex flex-col rounded-lg lg:p-1 relative">
			<div className="min-h-80 shadow aspect-square w-full overflow-hidden rounded-md bg-gray-100 group-hover:opacity-75 lg:h-80">
				<img src={product.coverURL} alt={product.name} className="h-full w-full object-cover object-center" />
			</div>
			<div className="flex flex-col sm:flex-row justify-between gap-y-2 gap-x-4 py-2 px-1">
				<div>
					<h3 className="text-sm text-gray-700">
						<Link to={`/product/${product._id}`}>
							<span aria-hidden="true" className="absolute inset-0" />
							{product.name}
						</Link>
					</h3>
				</div>
				<p className="text-sm font-medium text-gray-900">{moneyFormat(product.price)}</p>
			</div>
		</div>
	);
}
