import { UserCircleIcon } from '@heroicons/react/24/outline';
import { cn } from '../../helpers';
import { HiOutlineLocationMarker, FiPackage } from 'react-icons/all';
import { Link, Outlet, useLocation } from 'react-router-dom';

const subNavigation = [
	{ name: 'Profile', href: '/profile', icon: UserCircleIcon },
	{ name: 'Address', href: '/profile/address', icon: HiOutlineLocationMarker },
	{ name: 'Order History', href: '/profile/orders', icon: FiPackage }
];

export default function Profile() {
	const { pathname } = useLocation();
	return (
		<div className="h-full">
			<main className="container mx-auto pb-10 lg:py-12 lg:px-4">
				<div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
					<aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
						<nav className="space-y-1">
							{subNavigation.map(item => (
								<Link
									key={item.name}
									to={item.href}
									className={cn(
										pathname === item.href
											? 'bg-gray-50 text-orange-600 hover:bg-white'
											: 'text-gray-900 hover:text-gray-900 hover:bg-gray-50',
										'group rounded-md px-3 py-2 flex items-center text-sm font-medium'
									)}
									aria-current={pathname === item.href ? 'page' : undefined}
								>
									<item.icon
										className={cn(
											pathname === item.href
												? 'text-orange-500'
												: 'text-gray-400 group-hover:text-gray-500',
											'flex-shrink-0 -ml-1 mr-3 h-6 w-6'
										)}
										aria-hidden="true"
									/>
									<span className="truncate">{item.name}</span>
								</Link>
							))}
						</nav>
					</aside>
					<div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
						<Outlet />
					</div>
				</div>
			</main>
		</div>
	);
}
