import { useLocation, Navigate, createBrowserRouter, useLoaderData } from 'react-router-dom';
import { Home, ChatRoom, ChatWelcome, Login, NotFound, Register, ErrorPage, AuthRedirect } from '../pages';
import { useAuthStore } from '../store';
import { ReactNode, useEffect, useState } from 'react';
import altogic from '../libs/altogic';
import { logout } from '../helpers/auth';

export default createBrowserRouter([
	{
		path: '/',
		loader: async () => altogic.auth.getUserFromDB(),
		element: (
			// @ts-ignore
			<RequireAuth>
				<Home />
			</RequireAuth>
		),
		children: [
			{
				index: true,
				element: <ChatWelcome />,
			},
			{
				path: '/group/:groupId',
				element: <ChatRoom />,
			},
			{
				path: '/user/:userId',
				element: <ChatRoom />,
			},
		],
		errorElement: <ErrorPage />,
	},
	{
		path: '/login',
		element: (
			// @ts-ignore
			<GuestOnly>
				<Login />
			</GuestOnly>
		),
	},
	{
		path: '/register',
		element: (
			// @ts-ignore
			<GuestOnly>
				<Register />
			</GuestOnly>
		),
	},
	{
		path: 'auth-redirect',
		element: <AuthRedirect />,
	},
	{
		path: '*',
		element: <NotFound />,
	},
]);

function RequireAuth({ children }: { children: ReactNode }) {
	const { user, session, reset } = useAuthStore();
	const [ready, setReady] = useState(false);
	const loader = useLoaderData();
	const location = useLocation();

	const logoutHandler = async () => {
		await logout();
		reset();
	};

	useEffect(() => {
		// @ts-ignore
		if (loader?.user) setReady(true);
		else logoutHandler();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!user || !session) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	if (ready) return children;
}
function GuestOnly({ children }: { children: ReactNode }) {
	const { user, session } = useAuthStore();

	if (user && session) {
		return <Navigate to="/" />;
	}

	return children;
}
