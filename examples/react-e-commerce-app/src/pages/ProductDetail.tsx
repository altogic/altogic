import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import { Product } from '../types/altogic';
import { cn, moneyFormat } from '../helpers';
import useCartStore from '../store/cart';
import { ChangeEvent, useMemo, useState } from 'react';
import Button from '../components/ui/Button';
import { toast } from 'react-toastify';
import CartService from '../services/CartService';
import useAuthStore from '../store/auth';
import { groupBy } from 'lodash';

interface Loader {
	product: Product;
	variants: Product[];
}

export default function ProductDetail() {
	const { product, variants } = useLoaderData() as Loader;
	const { addToCart } = useCartStore();
	const { user } = useAuthStore();
	const [quantity, setQuantity] = useState(1);
	const [adding, setAdding] = useState(false);
	const navigate = useNavigate();

	const { colors, sizes } = useMemo(() => {
		const colorGroups = groupBy(variants, 'color.name');

		const colors = Object.keys(colorGroups).map(item => ({
			name: item === 'undefined' ? false : item,
			link: `/product/${colorGroups[item][0]._id}`,
			isActive: colorGroups[item].some(item => item._id === product._id),
			sizes: colorGroups[item].map(p => ({
				name: p.size?.name,
				product: p._id,
				isActive: product._id === p._id,
				link: `/product/${p._id}`
			}))
		}));

		const sizes = (colors.find(color => color.isActive)?.sizes || []) as {
			name: string;
			product: string;
			isActive: boolean;
			link: string;
		}[];

		return {
			colors: colors.filter(color => color.name),
			sizes
		};
	}, [variants]);

	function handleQuantity(e: ChangeEvent<HTMLInputElement>) {
		const number = e.target.valueAsNumber;
		if (!number) return setQuantity(1);
		if (number > product.qtyInStock) return setQuantity(product.qtyInStock);
		setQuantity(e.target.valueAsNumber);
	}

	async function handleClick() {
		if (!user) return navigate('/auth/login');
		toast.dismiss();
		try {
			setAdding(true);
			let cart = await CartService.addToCart({
				product: product._id,
				user: user._id,
				quantity
			});
			addToCart(cart);
			toast.success('Product added to cart', { autoClose: 1000, position: 'top-center' });
		} catch (error) {
			console.log(error);
			// @ts-ignore
			toast.error(error.items[0].message);
		} finally {
			setAdding(false);
		}
	}

	return (
		<section className="container mx-auto">
			<div className="relative px-4 py-8 mx-auto">
				<div className="grid items-start grid-cols-1 gap-4 md:gap-8 md:grid-cols-2">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-1">
						<img
							alt={product.name}
							src={product.coverURL}
							className="object-cover w-full aspect-square rounded-xl"
						/>
					</div>
					<div className="sticky top-0">
						<div className="flex justify-between">
							<div className="max-w-[35ch]">
								<h1 className="text-2xl font-bold">{product.name}</h1>
							</div>

							<p className="text-lg font-bold">{moneyFormat(product.price)}</p>
						</div>

						<div className="mt-4">
							<div className="font-bold text-lg text-gray-800">Description</div>
							<div className="prose">
								<p>{product.description}</p>
							</div>
						</div>

						{colors.length > 0 && (
							<div className="mt-4">
								<p className="mb-1 text-sm font-medium">Color</p>

								<div className="flow-root">
									<div className="flex flex-wrap gap-1">
										{colors.map((color, index) => (
											<Link
												key={index}
												to={color.link}
												className={cn(
													'inline-block px-3 py-1 text-xs font-medium border rounded-full hover:bg-gray-200',
													color.isActive ? '!bg-indigo-600 text-white' : ''
												)}
											>
												{color.name}
											</Link>
										))}
									</div>
								</div>
							</div>
						)}

						{sizes.length > 0 && (
							<div className="mt-4">
								<p className="mb-1 text-sm font-medium">Size</p>

								<div className="flow-root">
									<div className="flex flex-wrap gap-1">
										{sizes.map((size, index) => (
											<Link
												key={index}
												to={size.link}
												className={cn(
													'inline-block px-3 py-1 text-xs font-medium border rounded-full hover:bg-gray-200',
													size.isActive ? '!bg-indigo-600 text-white' : ''
												)}
											>
												{size.name}
											</Link>
										))}
									</div>
								</div>
							</div>
						)}

						<div className="mt-4">
							<div className={cn('gap-2 flex flex-wrap items-center')}>
								{product.qtyInStock >= 1 ? (
									<>
										<div className="w-20">
											<label htmlFor="quantity" className="sr-only">
												Qty
											</label>
											<input
												type="number"
												value={quantity}
												id="quantity"
												onChange={handleQuantity}
												min="1"
												className="w-full rounded border-gray-200"
											/>
										</div>
										<Button className="max-[728px]:flex-1" loading={adding} onClick={handleClick}>
											Add to Cart
										</Button>
									</>
								) : (
									<div className="text-red-600 font-semibold text-lg py-4">Out of stock</div>
								)}
								{user?.isAdmin && (
									<Button
										className="text-center max-[728px]:flex-[1_1_100%]"
										as="link"
										href={`/admin/products/edit/${product._id}`}
										variant="secondary"
									>
										Edit this Product
									</Button>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
