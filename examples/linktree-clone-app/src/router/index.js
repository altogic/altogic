import { createBrowserRouter, Navigate, useLocation, redirect } from 'react-router-dom';
import Home from '../pages/Home';
import UserProfile from '../pages/UserProfile';
import Login from '../pages/Login';
import Register from '../pages/Register';
import { useAuthStore } from '../store';
import altogic from '../lib/altogic';
import ErrorPage from '../pages/ErrorPage';

const linkLoader = async ({ params }) => {
	const { data, errors } = await altogic.db
		.model('links')
		.filter(`belongsTo.username == '${params.username}'`)
		.lookup({ field: 'icon' })
		.lookup({ field: 'belongsTo' })
		.sort('createdAt', 'desc')
		.get();

	const { data: linkIcons, errors: linkIconsError } = await altogic.db.model('linkTypes').get();

	if (errors || linkIconsError) {
		throw new Response('Somethings went wrong', { status: 500 });
	}

	return { links: data, linkIcons };
};

const router = createBrowserRouter([
	{
		path: '/',
		loader: () => {
			const user = useAuthStore.getState().user;
			if (user) {
				return redirect(`/${user.username}`);
			}
		},
		element: (
			<RequireAuth>
				<Home />
			</RequireAuth>
		),
	},
	{
		path: '/login',
		element: (
			<GuestOnly>
				<Login />
			</GuestOnly>
		),
	},
	{
		path: '/register',
		element: (
			<GuestOnly>
				<Register />
			</GuestOnly>
		),
	},
	{
		path: ':username',
		loader: linkLoader,
		element: <UserProfile />,
		errorElement: <ErrorPage />,
	},
]);

function RequireAuth({ children }) {
	const { user, session } = useAuthStore();
	const location = useLocation();

	if (!user || !session) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	return children;
}
function GuestOnly({ children }) {
	const { user, session } = useAuthStore();

	if (user && session) {
		return <Navigate to="/" />;
	}

	return children;
}

export default router;
