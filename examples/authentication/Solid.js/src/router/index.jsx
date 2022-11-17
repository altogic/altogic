import { Navigate, Outlet, Route, Routes } from '@solidjs/router';
import { useAuth } from '../context/AuthContext';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import LoginWithMagicLink from '../pages/LoginWithMagicLink';
import AuthRedirect from '../pages/AuthRedirect';

export default function Router() {
	return (
		<Routes>
			<Route path="" component={PublicRoute}>
				<Route path="/" component={Home} />
				<Route path="/login" component={Login} />
				<Route path="/register" component={Register} />
				<Route path="/login-with-magic-link" component={LoginWithMagicLink} />
			</Route>
			<Route path="" component={ProtectedRoute}>
				<Route path="/profile" component={Profile} />
			</Route>
			<Route path="/auth-redirect" component={AuthRedirect} />
		</Routes>
	);
}

function ProtectedRoute() {
	const [{ user, session }] = useAuth();
	if (user && session) {
		return <Outlet />;
	}
	return <Navigate href="/login" />;
}

function PublicRoute() {
	const [{ user, session }] = useAuth();
	if (!user && !session) {
		return <Outlet />;
	}
	return <Navigate href="/profile" />;
}
