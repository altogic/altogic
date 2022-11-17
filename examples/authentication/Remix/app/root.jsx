import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import styles from './styles/app.css';
import { getUserFromDbAndWriteToSession } from '~/utils/auth.server';
import { json, redirect } from '@remix-run/node';

export const meta = () => ({
	charset: 'utf-8',
	title: 'Altogic Auth Sample With Remix',
	viewport: 'width=device-width,initial-scale=1',
});
export function links() {
	return [{ rel: 'stylesheet', href: styles }];
}

export async function loader({ request }) {
	console.log('Main Loader');
	const authPaths = ['/profile'];
	const url = new URL(request.url);
	return getUserFromDbAndWriteToSession(request, authPaths.includes(url.pathname));
}

export default function App() {
	return (
		<html lang="en">
			<head>
				<Meta />
				<Links />
			</head>
			<body>
				<main className="container mx-auto px-2">
					<Outlet />
				</main>
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}
