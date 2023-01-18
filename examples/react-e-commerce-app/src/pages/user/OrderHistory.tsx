import Button from '../../components/ui/Button';
import { useLoaderData, useSearchParams } from 'react-router-dom';
import { Order, PaginateData } from '../../types/altogic';
import { moneyFormat } from '../../helpers';
import { format } from 'date-fns';
import Pagination from '../../components/Pagination';
import { useState } from 'react';
import { OrderService } from '../../services';
import { TbTruckDelivery } from 'react-icons/all';

interface OrderLoader {
	orders: Order[];
	paginateData: PaginateData;
}
export default function OrderHistory() {
	const { orders: orderFromDB, paginateData: paginateDataFromDB } = useLoaderData() as OrderLoader;
	const [orders, setOrders] = useState(orderFromDB);
	const [paginateData, setPaginateData] = useState(paginateDataFromDB);
	const [searchParams] = useSearchParams();

	async function getPaginateProducts() {
		const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
		const { orders, paginateData } = await OrderService.getOrders(page);
		setOrders(orders);
		setPaginateData(paginateData);
	}

	return (
		<section className="py-6 px-4 space-y-4 sm:p-6 sm:px-0 sm:pt-0 lg:pb-8">
			<div>
				<div>
					<h2 className="text-lg leading-6 font-medium text-gray-900">Order history</h2>
					<p className="mt-1 text-sm text-gray-500">
						Check the status of recent orders, manage returns, and discover similar products.
					</p>
				</div>
			</div>

			{orders.length === 0 ? (
				<div className="border p-4 shadow rounded text-center text-gray-700">You do not have any orders</div>
			) : (
				<>
					{orders?.map(order => (
						<div key={order._id} className="bg-white border-gray-200 shadow-sm rounded-lg border p-4">
							<div className="flex items-center">
								<dl className="flex-1 grid sm:grid-cols-2 gap-2 md:grid-cols-4">
									<div>
										<dt className="font-medium text-gray-900">Order number</dt>
										<dd className="mt-1 text-gray-500 select-all">
											#{order.orderNumber?.toString().padStart(6, '0')}
										</dd>
									</div>
									<div>
										<dt className="font-medium text-gray-900">Order date</dt>
										<dd className="mt-1 text-gray-500">
											<time dateTime={order.createdAt}>
												{format(new Date(order.createdAt), 'P')}
											</time>
										</dd>
									</div>
									<div>
										<dt className="font-medium text-gray-900">Order status</dt>
										<dd className="mt-1 font-medium text-gray-500">{order.status}</dd>
									</div>
									<div>
										<dt className="font-medium text-gray-900">Total amount</dt>
										<dd className="mt-1 font-medium text-gray-500">
											{moneyFormat(order.totalPrice)}
										</dd>
									</div>
								</dl>
								<div className="flex gap-1 flex-col sm:flex-row items-center justify-center">
									<Button
										size="small"
										as={order.trackingURL ? 'link' : 'button'}
										href={order.trackingURL}
										disabled={!order.trackingURL}
										variant="primary"
										className="flex items-center gap-1"
									>
										<TbTruckDelivery size={15} /> Track the order
									</Button>
									<Button
										size="small"
										as="link"
										href={`/profile/orders/${order._id}`}
										variant="secondary"
									>
										View details
									</Button>
								</div>
							</div>
						</div>
					))}
					<Pagination paginateData={paginateData} onPageChange={getPaginateProducts} />
				</>
			)}
		</section>
	);
}
