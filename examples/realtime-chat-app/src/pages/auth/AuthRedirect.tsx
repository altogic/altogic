import { Container, ShowAPIError } from '../../components';
import { verifyToken } from '../../helpers/auth';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store';
import { APIError } from 'altogic';
import { useNavigate } from 'react-router-dom';

export default function AuthRedirect() {
	const token = new URLSearchParams(document.location.search).get('access_token');
	const { setUser, setSession } = useAuthStore();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<APIError | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		if (!token) return;

		verifyToken(token)
			.then(({ user, errors, session }) => {
				setLoading(false);
				if (errors) setError(errors);
				else {
					setUser(user);
					setSession(session);
					navigate('/');
				}
			})
			.catch(console.error);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!token) {
		return (
			<Container className="flex h-full items-center justify-center">
				<div className="space-y-2">
					<h1 className="text-center text-6xl">You can not redirect</h1>
					<h2 className="text-center text-3xl text-red-600 dark:text-red-400">Token not found!</h2>
				</div>
			</Container>
		);
	}
	if (loading) {
		return (
			<Container className="flex h-full items-center justify-center">
				<h1 className="text-center text-6xl">Wait a second...</h1>
			</Container>
		);
	}
	if (error) {
		return (
			<Container className="flex h-full items-center justify-center">
				<ShowAPIError error={error} />
			</Container>
		);
	}

	return (
		<Container className="flex h-full items-center justify-center">
			<h1 className="text-center text-6xl">You're redirecting...</h1>
		</Container>
	);
}
