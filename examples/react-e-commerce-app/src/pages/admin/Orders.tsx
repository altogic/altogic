import AdminLayout from '../../layouts/AdminLayout';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import { format } from 'date-fns';
import { useLoaderData, useSearchParams } from 'react-router-dom';
import { Order, OrderStatus, PaginateData } from '../../types/altogic';
import { moneyFormat } from '../../helpers';
import Pagination from '../../components/Pagination';
import { useState } from 'react';
import { OrderService } from '../../services';
import Dropdown from '../../components/ui/Dropdown';
import { toast } from 'react-toastify';
import { APIError } from 'altogic';
import altogic from '../../libs/altogic';
import InputModal from '../../components/InputModal';
import { FaShippingFast } from 'react-icons/all';
import SearchOrder from '../../components/SearchOrder';
const status: OrderStatus[] = ['waiting', 'preparing', 'shipped', 'completed', 'canceled'];

interface OrderLoader {
	orders: Order[];
	paginateData: PaginateData;
}
export default function Orders() {
	const { orders: orderFromDB, paginateData: paginateDataFromDB } = useLoaderData() as OrderLoader;
	const [orders, setOrders] = useState(orderFromDB);
	const [paginateData, setPaginateData] = useState(paginateDataFromDB);
	const [open, setOpen] = useState(false);
	const [selectedOrderId, setSelectedOrderId] = useState<string>();
	const [selectedOrderTrackingURL, setSelectedOrderTrackingURL] = useState<string>();
	const [updating, setUpdating] = useState(false);
	const [searchParams] = useSearchParams();

	const cols = [
		{ colName: 'Order Number' },
		{ colName: 'Customer' },
		{ colName: 'Total Price' },
		{ colName: 'Status' },
		{ colName: 'Created At', className: 'w-52' },
		{ colName: 'Tracking URL' },
		{
			colName: 'Actions',
			className: 'w-24 text-center'
		}
	];
	const rows = orders.map(order => ({
		orderNumber: '#' + order.orderNumber.toString().padStart(6, '0'),
		customer: order.user?.name || '-',
		total: moneyFormat(order.totalPrice),
		status: order.status,
		createdAt: format(new Date(order.createdAt), 'P p'),
		tracking: (
			<span className="flex justify-center">
				{order.trackingURL ? (
					<a title="Click to track the order" target="_blank" rel="noreferrer" href={order.trackingURL}>
						<FaShippingFast className="hover:text-indigo-700 transition-all" size={25} />
					</a>
				) : (
					'-'
				)}
			</span>
		),
		actions: (
			<div className="flex gap-2">
				<Button onClick={() => showInputModal(order._id, order.trackingURL)} variant="white" size="small">
					Set tracking URL
				</Button>
				<Dropdown buttonVariant="primary" buttonSize="small" items={items(order._id)}>
					Change status
				</Dropdown>
				<Button
					as="link"
					href={`/admin/orders/${order._id}?orderNumber=${order.orderNumber}`}
					variant="secondary"
					size="small"
				>
					View details
				</Button>
			</div>
		)
	}));

	function showInputModal(orderId: string, url?: string) {
		setOpen(true);
		setSelectedOrderId(orderId);
		setSelectedOrderTrackingURL(url);
	}
	function items(orderId: string) {
		return status.map(item => ({
			title: `Set to ${item}`,
			onClick: () => updateStatus(orderId, item)
		}));
	}
	async function updateStatus(orderId: string, status: OrderStatus) {
		toast.dismiss();
		const loading = toast.loading('Order updating...', {
			closeOnClick: true,
			isLoading: false,
			closeButton: true,
			autoClose: 2000
		});
		try {
			const order = await OrderService.updateOrderStatus(orderId, status);
			setOrders(prev =>
				prev.map(item => {
					if (item._id === orderId) item.status = order.status;
					return item;
				})
			);
			altogic.realtime.send('admin', 'waiting-order-count', false);
			toast.update(loading, {
				render: 'Order status updated',
				type: 'success'
			});
		} catch (e) {
			toast.dismiss(loading);
			(e as APIError).items.forEach(item => toast.error(item.message));
		}
	}
	async function onTrackingURLSubmit(value: string, reset: () => void) {
		if (!selectedOrderId) return;
		setUpdating(true);
		try {
			const order = await OrderService.setTrackingURL(selectedOrderId, value);
			setOrders(prev =>
				prev.map(item => {
					if (item._id === order._id) item.trackingURL = order.trackingURL;
					return item;
				})
			);
			reset();
		} catch (e) {
			(e as APIError).items.forEach(item => toast.error(item.message));
		} finally {
			setUpdating(false);
			setOpen(false);
		}
	}
	async function getPaginateProducts() {
		const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
		const { orders, paginateData } = await OrderService.getAllOrders(page);
		setOrders(orders);
		setPaginateData(paginateData);
	}

	return (
		<AdminLayout title="Orders">
			<>
				<InputModal
					label="Tracking URL"
					isOpen={open}
					inputType="url"
					loading={updating}
					defaultValue={selectedOrderTrackingURL}
					close={() => setOpen(false)}
					inputPlaceholder="Type order's tracking URL"
					onSubmit={onTrackingURLSubmit}
				/>
				<div className="px-4 sm:p-0 space-y-2">
					{orders.length > 0 ? (
						<>
							<div className="flex justify-end">
								<SearchOrder />
							</div>
							<Table cols={cols} rows={rows} />
							<Pagination onPageChange={getPaginateProducts} paginateData={paginateData} />
						</>
					) : (
						<div>
							<h1 className="text-2xl font-semibold text-center">No Orders Found</h1>
						</div>
					)}
				</div>
			</>
		</AdminLayout>
	);
}
