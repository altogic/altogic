import { cn } from '../../helpers';
import { IoCloseSharp, TfiMenu } from 'react-icons/all';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import useAuthStore from '../../store/auth';
import { Link, useLocation } from 'react-router-dom';
import UserAvatar from '../UserAvatar';
import { BsShopWindow } from 'react-icons/all';
import { useAdminStore } from '../../store';

const navigation = [
	{ name: 'Dashboard', href: '/admin' },
	{ name: 'Products', href: '/admin/products' },
	{ name: 'Categories', href: '/admin/categories' },
	{ name: 'Orders', href: '/admin/orders' },
	{
		name: (
			<span className="flex items-center gap-2">
				<BsShopWindow className="w-5 h-5 sm:w-4 sm:h-4" />
				View the Shop
			</span>
		),
		href: '/',
		native: true
	}
];
const userNavigation = [
	{ name: 'Profile', href: '/profile' },
	{ name: 'Logout', href: '/auth/logout' }
];
export default function Navbar() {
	const { user } = useAuthStore();
	const { pathname } = useLocation();
	const { waitingOrderCount } = useAdminStore();
	return (
		<Disclosure as="nav" className="bg-gray-800">
			{({ open }) => (
				<>
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						<div className="flex h-16 items-center justify-between">
							<div className="flex items-center">
								<div className="flex-shrink-0 text-white font-bold tracking-widest">
									<Link to="/admin">ADMIN PANEL</Link>
								</div>
								<div className="hidden md:block">
									<div className="ml-10 flex items-center gap-4">
										{navigation.map((item, index) =>
											item.native ? (
												<a
													className={cn(
														'text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium'
													)}
													key={index}
													href={item.href}
												>
													{item.name}
												</a>
											) : (
												<Link
													aria-current={item.href === pathname ? 'page' : undefined}
													className={cn(
														item.href === pathname
															? 'bg-gray-900 text-white active'
															: 'text-gray-300 hover:bg-gray-700 hover:text-white',
														'px-3 py-2 rounded-md text-sm font-medium relative'
													)}
													key={index}
													to={item.href}
												>
													{item.href === '/admin/orders' && waitingOrderCount > 0 && (
														<span className="absolute -top-1 text-white -right-1 tabular-nums flex items-center h-5 w-5 justify-center bg-red-500 rounded-full text-[10px]">
															{waitingOrderCount}
														</span>
													)}
													{item.name}
												</Link>
											)
										)}
									</div>
								</div>
							</div>
							<div className="hidden md:block">
								<div className="ml-4 flex items-center md:ml-6">
									{/* Profile dropdown */}
									<Menu as="div" className="relative ml-3">
										<div>
											<Menu.Button className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
												<span className="sr-only">Open user menu</span>
												<UserAvatar className="!w-10 !h-10" />
											</Menu.Button>
										</div>
										<Transition
											as={Fragment}
											enter="transition ease-out duration-100"
											enterFrom="transform opacity-0 scale-95"
											enterTo="transform opacity-100 scale-100"
											leave="transition ease-in duration-75"
											leaveFrom="transform opacity-100 scale-100"
											leaveTo="transform opacity-0 scale-95"
										>
											<Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
												{userNavigation.map(item => (
													<Menu.Item key={item.name}>
														<Link
															aria-current={item.href === pathname ? 'page' : undefined}
															to={item.href}
															className={cn(
																pathname === item.href ? 'bg-gray-100' : '',
																'block px-4 py-2 text-sm text-gray-700'
															)}
														>
															{item.name}
														</Link>
													</Menu.Item>
												))}
											</Menu.Items>
										</Transition>
									</Menu>
								</div>
							</div>
							<div className="-mr-2 flex md:hidden">
								{/* Mobile menu button */}
								<Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
									<span className="sr-only">Open main menu</span>
									{open ? (
										<IoCloseSharp className="block h-6 w-6" aria-hidden="true" />
									) : (
										<TfiMenu className="block h-6 w-6" aria-hidden="true" />
									)}
								</Disclosure.Button>
							</div>
						</div>
					</div>

					<Disclosure.Panel className="md:hidden">
						<div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
							{navigation.map((item, index) => (
								<Disclosure.Button
									key={index}
									as={Link}
									to={item.href}
									aria-current={item.href === pathname ? 'page' : undefined}
									className={cn(
										item.href === pathname
											? 'bg-gray-900 text-white'
											: 'text-gray-300 hover:bg-gray-700 hover:text-white',
										'block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2'
									)}
								>
									{item.name}
									{item.href === '/admin/orders' && waitingOrderCount > 0 && (
										<span className="text-white tabular-nums flex items-center h-6 w-6 justify-center bg-red-500 rounded-full text-[12px]">
											{waitingOrderCount}
										</span>
									)}
								</Disclosure.Button>
							))}
						</div>
						<div className="border-t border-gray-700 pt-4 pb-3">
							<div className="flex items-center px-5">
								<div className="flex-shrink-0">
									<UserAvatar />
								</div>
								<div className="ml-3 flex flex-col gap-1">
									<div className="text-base font-medium leading-none text-white">{user?.name}</div>
									<div className="text-sm font-medium leading-none text-gray-400">{user?.email}</div>
								</div>
							</div>
							<div className="mt-3 space-y-1 px-2">
								{userNavigation.map(item => (
									<Disclosure.Button
										key={item.name}
										as={Link}
										to={item.href}
										className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
									>
										{item.name}
									</Disclosure.Button>
								))}
							</div>
						</div>
					</Disclosure.Panel>
				</>
			)}
		</Disclosure>
	);
}
