import { FiShoppingCart } from 'react-icons/all';
import useCartStore from '../store/cart';
import { Link } from 'react-router-dom';

export default function ShoppingCart() {
	const { items } = useCartStore();
	return (
		<Link
			to="/cart"
			className="h-full group flex transition hover:bg-secondary items-center border-l-2 border-secondary gap-4 justify-center px-4 lg:px-6"
		>
			<span className="relative">
				<FiShoppingCart size={25} />
				<span className="absolute -translate-y-full translate-x-1/2 text-xs min-h-[20px] min-w-[20px] aspect-square tabular-nums absolute top-1 right-0 bg-green-600 rounded-full flex items-center justify-center text-white">
					{items.length}
				</span>
			</span>
		</Link>
	);
}
