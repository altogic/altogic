import { ReactElement } from 'react';
import Navbar from '../components/admin/Navbar';
interface AdminLayoutProps {
	children: ReactElement;
	title?: string;
}
export default function AdminLayout({ children, title = 'Dashboard' }: AdminLayoutProps) {
	return (
		<div className="min-h-full">
			<Navbar />
			<header className="bg-white shadow">
				<div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
					<h1 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
				</div>
			</header>
			<main>
				<div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">{children}</div>
			</main>
		</div>
	);
}
