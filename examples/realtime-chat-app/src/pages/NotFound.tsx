import { Link } from 'react-router-dom';

export default function NotFound() {
	return (
		<div className="flex h-full flex-col items-center justify-center gap-4 px-4">
			<h1 className="text-center text-8xl">404</h1>
			<Link
				className="rounded border border-black bg-white px-4 py-2 text-black dark:border-white dark:bg-gray-800 dark:text-white"
				to="/"
			>
				Go Home
			</Link>
		</div>
	);
}
