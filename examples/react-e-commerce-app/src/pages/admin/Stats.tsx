import AdminLayout from '../../layouts/AdminLayout';
import { OrderStatus } from '../../types/altogic';
import { capitalize, moneyFormat } from '../../helpers';
import { BiStats, GiTakeMyMoney } from 'react-icons/all';
import { Link, useLoaderData } from 'react-router-dom';
import { useMemo } from 'react';

type Stats = {
	[key in OrderStatus]?: number;
};

interface LoaderData {
	orderStats: Stats;
	totalSales: number;
}
export default function Stats() {
	const { orderStats, totalSales } = useLoaderData() as LoaderData;

	const _stats = useMemo(() => {
		const total = {
			'Total sales amount': moneyFormat(totalSales),
			total: Object.values(orderStats).reduce((a, b) => a + b, 0)
		};
		return Object.entries({ ...total, ...orderStats }).map(([status, count]) => [
			capitalize(status) + (status.includes('amount') ? '' : ' orders'),
			count
		]) as [string, number][];
	}, [orderStats]);

	return (
		<AdminLayout title="Dashboard">
			<section>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 px-4 sm:px-0">
					{_stats.map(([status, count], index) => (
						<article
							key={index}
							className="relative group cursor-pointer hover:bg-gray-50 flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6"
						>
							<span className="rounded-full bg-blue-100 p-3 text-blue-600">
								{status.includes('amount') ? <GiTakeMyMoney size={25} /> : <BiStats size={25} />}
							</span>

							<div>
								<p className="text-2xl font-medium tabular-nums text-gray-900">{count}</p>
								<Link
									to="/admin/orders"
									className="text-sm text-gray-500 underline-offset-4 group-hover:text-indigo-700 group-hover:underline absolute inset-0"
								/>
								<p className="text-sm text-gray-500">{status}</p>
							</div>
						</article>
					))}
				</div>
			</section>
		</AdminLayout>
	);
}
