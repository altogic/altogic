import AdminLayout from '../../layouts/AdminLayout';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import { Link, useLoaderData, useParams, useSearchParams } from 'react-router-dom';
import { OrderItem, OrderStatus } from '../../types/altogic';
import { moneyFormat } from '../../helpers';
import SelectBox from '../../components/ui/SelectBox';
import { useState } from 'react';
import { OrderService } from '../../services';
import { toast } from 'react-toastify';
import { APIError } from 'altogic';

const status: OrderStatus[] = ['waiting', 'preparing', 'shipped', 'completed', 'canceled'];

export default function OrderDetails() {
	const orderDetails = useLoaderData() as OrderItem[];
	const [currentStatus, setCurrentStatus] = useState<OrderStatus>(orderDetails[0].order.status);
	const [updating, setUpdating] = useState(false);
	const { orderId } = useParams();
	const [searchParams] = useSearchParams();

	const cols = [
		{ colName: '', className: 'min-w-[6rem] w-24' },
		{ colName: 'Product Name' },
		{ colName: 'Quantity' },
		{ colName: 'Price' },
		{
			colName: 'Actions',
			className: 'w-24'
		}
	];
	const rows = orderDetails.map(item => ({
		cover: (
			<img
				className="object-cover w-16 h-24 rounded"
				src={item?.product?.coverURL ?? '/no-image.png'}
				alt={item.productName}
			/>
		),
		productName: item.productName,
		quantity: item.quantity,
		price: moneyFormat(item.price),
		actions: item?.product?._id ? (
			<div className="flex gap-2">
				<Button as="link" href={`/product/${item?.product?._id}`} variant="secondary" size="small">
					View product
				</Button>
			</div>
		) : (
			<p>The product is no longer available</p>
		)
	}));

	async function updateStatusHandler() {
		if (!orderId) return;
		if (!currentStatus) {
			return toast.error("Status can't be empty");
		}
		try {
			setUpdating(true);
			await OrderService.updateOrderStatus(orderId, currentStatus);
			toast.success('Order status updated');
		} catch (e) {
			(e as APIError).items.forEach(item => toast.error(item.message));
		} finally {
			setUpdating(false);
		}
	}

	return (
		<AdminLayout title="Order Details">
			<div className="px-4 sm:p-0 space-y-2">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
					<h1 className="font-semibold text-2xl">
						Order #{searchParams.get('orderNumber')?.padStart(6, '0')}
					</h1>
					<div className="flex items-center gap-2">
						<SelectBox
							firstSelectionText="Select a status"
							onChange={e => setCurrentStatus(e.target.value as OrderStatus)}
							value={currentStatus}
							name="status"
							fields={status.map(value => ({ id: value, value: value }))}
						/>
						<Button
							loading={updating}
							className="py-2 sm:py-1.5 whitespace-nowrap"
							onClick={updateStatusHandler}
						>
							Save Status
						</Button>
					</div>
				</div>
				<Table cols={cols} rows={rows} />
			</div>
		</AdminLayout>
	);
}
