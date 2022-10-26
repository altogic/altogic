import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useInternetConnection from '../hooks/useInternetConnection';

export default function ErrorPage() {
	const error = useRouteError();
	const [loading, setLoading] = useState(false);
	const isOnline = useInternetConnection();
	const isRouteError = isRouteErrorResponse(error);

	useEffect(() => {
		if (isOnline && !isRouteError) {
			setLoading(true);
			window.location.replace('/');
		}
	}, [isOnline, isRouteError]);

	console.group('ErrorPage');
	console.error(error);
	console.groupEnd();

	return (
		<section className="flex h-screen flex-col items-center justify-center text-center text-2xl font-medium">
			{isOnline && !loading ? (
				<div className="grid justify-items-center gap-3 text-red-500">
					<span className="text-8xl">Error !!!</span>
					<p>Somethings went wrong, please try again.</p>
					<a href="/" className="w-fit rounded border border-2 bg-white px-4 py-2 text-gray-600">
						Refresh Now
					</a>
				</div>
			) : (
				<div className="text-black dark:text-white">
					<h1 className="mb-2 text-8xl">You Are Offline</h1>
					<p className="text-3xl">Please check your internet connection</p>
					<small className="text-sm">we'll automatically log you in when your connection comes back</small>
				</div>
			)}
		</section>
	);
}
