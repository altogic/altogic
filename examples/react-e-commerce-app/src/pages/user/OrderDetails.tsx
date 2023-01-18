import { useLoaderData } from 'react-router-dom';
import { OrderItem } from '../../types/altogic';
import { moneyFormat } from '../../helpers';
import Button from '../../components/ui/Button';

export default function OrderDetails() {
	const orderDetails = useLoaderData() as OrderItem[];
	return (
		<section className="py-6 px-4 space-y-4 sm:p-6 sm:px-0 sm:pt-0 lg:pb-8">
			<div>
				<div>
					<h2 className="text-lg leading-6 font-medium text-gray-900">Order details</h2>
				</div>
			</div>
			<ul role="list" className="flex flex-col gap-4 divide-gray-200">
				{orderDetails.map(item => (
					<li key={item._id} className="pb-4 border-b">
						<div className="flex items-center sm:items-start">
							<div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg overflow-hidden sm:w-40 sm:h-40">
								<img
									src={item?.product?.coverURL ?? '/no-image.png'}
									alt={item.productName}
									className="w-full h-full object-center object-cover"
								/>
							</div>
							<div className="flex-1 ml-6 text-sm">
								<div className="font-medium text-gray-900 sm:flex gap-4 sm:justify-between">
									<div>
										<h5 className="text-lg">{item.productName}</h5>
										<p className="hidden text-gray-500 sm:mt-2 sm:line-clamp-4">
											{item?.product?.description}
										</p>
									</div>
									<div className="flex items-center sm:flex-col sm:justify-center gap-2 shrink-0">
										<p>
											{moneyFormat(item.price)} x {item.quantity}
										</p>
										{item?.product?._id && (
											<Button
												variant="white"
												as="link"
												href={`/product/${item?.product?._id}`}
												size="small"
											>
												View product
											</Button>
										)}
									</div>
								</div>
							</div>
						</div>
					</li>
				))}
			</ul>
			<div className="text-right font-bold text-lg">
				Total: {moneyFormat(orderDetails.reduce((acc, curr) => (acc += curr.quantity * curr.price), 0))}
			</div>
		</section>
	);
}
