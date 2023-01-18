import { useProductStore } from '../store';
import { cn } from '../helpers';
import { Link } from 'react-router-dom';

export default function FeaturedProducts() {
	const { products, paginateData } = useProductStore();
	if (paginateData.currentPage !== 1) return null;
	const product = products.slice(0, 3);
	if (product.length < 3) return null;
	return (
		<div className="container mx-auto px-4 mt-5">
			<ul className="grid grid-cols-1 gap-4 h-[600px] [&>li_img] lg:grid-cols-3 [&>li]:rounded-md [&>li]:overflow-hidden">
				{products.slice(0, 3).map((product, index) => (
					<li
						key={index}
						style={{ backgroundImage: `URL(${product.coverURL})` }}
						className={cn(
							'relative bg-cover bg-no-repeat group',
							index === 2
								? 'lg:col-span-2 lg:col-start-2 lg:row-span-2 lg:row-start-1 bg-center'
								: 'bg-[center_bottom_-5rem]'
						)}
					>
						<div className="absolute transition-all inset-0 group-hover:bg-white/20" />
						<Link
							to={`/product/${product._id}`}
							style={{
								backgroundImage: 'linear-gradient(to top, black 0%, rgba(125, 185, 232, 0) 50%)'
							}}
							className="absolute inset-0 flex flex-col items-start justify-end p-6"
						>
							<h3 className="text-xl font-medium text-white text-shs">{product.name}</h3>
							<span className="mt-1.5 inline-block bg-gradient-to-r from-purple-800 via-violet-900 to-purple-800 px-5 py-3 text-xs font-medium uppercase tracking-wide text-white">
								View Product
							</span>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
