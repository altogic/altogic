import { Fragment, useState } from 'react';
import { Dialog, Popover, Transition } from '@headlessui/react';
import { Bars3Icon, ShoppingBagIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '../helpers';
import { Link, useLocation } from 'react-router-dom';
import useCartStore from '../store/cart';
import useAuthStore from '../store/auth';
import useCategoryStore from '../store/category';

export default function Header() {
	const [open, setOpen] = useState(false);
	const { pathname } = useLocation();
	const { items } = useCartStore();
	const { user } = useAuthStore();
	const { activeCategories } = useCategoryStore();

	const navigation = {
		pages: activeCategories.map(category => ({
			...category,
			href: `/category/${category.slug}`
		}))
	};
	const rightNavigationForGuest = [
		{
			name: 'Login',
			href: '/auth/login'
		},
		{
			name: 'Create Account',
			href: '/auth/register'
		}
	];
	const rightNavigationForAuth = [
		{
			name: 'Profile',
			href: '/profile'
		},
		{
			name: 'Logout',
			href: '/auth/logout'
		}
	];
	if (user?.isAdmin) {
		rightNavigationForAuth.unshift({
			name: 'Admin Panel',
			href: '/admin'
		});
	}

	return (
		<div className="bg-white sticky top-0 z-40">
			<Transition.Root show={open} as={Fragment}>
				<Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
					<Transition.Child
						as={Fragment}
						enter="transition-opacity ease-linear duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="transition-opacity ease-linear duration-300"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-black bg-opacity-25" />
					</Transition.Child>

					<div className="fixed inset-0 z-40 flex">
						<Transition.Child
							as={Fragment}
							enter="transition ease-in-out duration-300 transform"
							enterFrom="-translate-x-full"
							enterTo="translate-x-0"
							leave="transition ease-in-out duration-300 transform"
							leaveFrom="translate-x-0"
							leaveTo="-translate-x-full"
						>
							<Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
								<div className="flex pl-4 py-5">
									<button
										type="button"
										className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
										onClick={() => setOpen(false)}
									>
										<span className="sr-only">Close menu</span>
										<XMarkIcon className="h-6 w-6" aria-hidden="true" />
									</button>
								</div>

								{
									/* mobile left */
									navigation.pages.length > 0 ? (
										<div className="space-y-6 border-t border-gray-200 py-6 px-4">
											{navigation.pages.map((page, index) => (
												<div key={index} className="flow-root">
													<Link
														onClick={() => setOpen(false)}
														to={page.href}
														className="-m-2 block p-2 font-medium text-gray-900"
													>
														{page.name}
													</Link>
												</div>
											))}
										</div>
									) : undefined
								}

								{/* Mobile right nav */}
								<div className="space-y-6 border-t border-gray-200 py-6 px-4">
									{(user ? rightNavigationForAuth : rightNavigationForGuest).map((nav, index) => (
										<div key={index} className="flow-root">
											<Link
												onClick={() => setOpen(false)}
												to={nav.href}
												className={cn(
													'-m-2 block p-2 font-medium text-gray-900 border-b-2 border-transparent',
													pathname === nav.href ? '!border-gray-600' : ''
												)}
											>
												{nav.name}
											</Link>
										</div>
									))}
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition.Root>

			<header className="relative bg-white">
				<nav aria-label="Top" className="mx-auto container sm:px-4">
					<div className="border-b border-gray-200 px-1">
						<div className="flex h-16 items-center">
							<button
								type="button"
								className="rounded-md bg-white p-2 text-gray-400 lg:hidden"
								onClick={() => setOpen(true)}
							>
								<span className="sr-only">Open menu</span>
								<Bars3Icon className="h-6 w-6" aria-hidden="true" />
							</button>

							<div className="ml-4 flex lg:ml-0">
								<Link to="/">
									<span className="font-bold">SHOP</span>
								</Link>
							</div>

							<Popover.Group className="hidden lg:ml-8 lg:block lg:self-stretch">
								<div className="flex h-full gap-x-8 max-[1280px]:max-w-[500px] mr-4 overflow-x-auto">
									{navigation.pages.map(page => (
										<Link
											key={page.name}
											to={page.href}
											className={cn(
												'flex items-center border-b-2 border-transparent text-sm font-medium text-gray-700 hover:text-gray-800',
												pathname === page.href ? 'border-gray-600' : ''
											)}
										>
											{page.name}
										</Link>
									))}
								</div>
							</Popover.Group>

							{/* desktop right */}
							<div className="ml-auto h-full flex items-center">
								<div className="hidden h-full lg:flex lg:flex-1 lg:self-stretch lg:items-center lg:justify-end lg:gap-x-6">
									{(user ? rightNavigationForAuth : rightNavigationForGuest).map((nav, index) => (
										<Link
											key={index}
											to={nav.href}
											className={cn(
												'text-sm font-medium flex h-full items-center text-gray-700 hover:text-gray-800 border-b-2 border-transparent',
												pathname === nav.href ? 'border-gray-600' : ''
											)}
										>
											{nav.name}
										</Link>
									))}
								</div>

								{/* Cart */}
								<div className="flow-root lg:ml-6">
									<Link to="/cart" className="group flex items-center p-2">
										<ShoppingBagIcon
											className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
											aria-hidden="true"
										/>
										<span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
											{items.reduce((acc, curr) => (acc += curr.quantity), 0)}
										</span>
										<span className="sr-only">items in cart, view bag</span>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</nav>
			</header>
		</div>
	);
}
