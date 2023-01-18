import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { APIError } from 'altogic';
import altogic from '../libs/altogic';
import { useAuthStore } from '../store';
import { User } from '../types/altogic';
import Button from '../components/ui/Button';

export default function AuthRedirect() {
	const [errors, setErrors] = useState<APIError>();
	const { setUser, setSession } = useAuthStore();
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	useEffect(() => {
		loginWithToken().catch(console.error);
	}, []);

	async function loginWithToken() {
		const token = searchParams.get('access_token');
		if (!token) {
			return setErrors({
				status: 400,
				statusText: 'Bad Request',
				items: [
					{
						message: 'Access token is missing.',
						origin: '',
						code: ''
					}
				]
			});
		}
		const { user, session, errors: apiErrors } = await altogic.auth.getAuthGrant(token);
		if (!apiErrors) {
			setSession(session);
			setUser(user as User);
			navigate('/profile');
		} else {
			setErrors(apiErrors);
		}
	}

	return (
		<section className="h-screen flex flex-col gap-4 justify-center items-center">
			{!errors ? (
				<div className="text-center">
					<p className="text-6xl">Please wait</p>
					<p className="text-3xl">You're redirecting to your profile...</p>
				</div>
			) : (
				<>
					{errors.items.map((error, key) => (
						<div key={key} className="text-center text-red-500 text-3xl">
							<p>{error.message}</p>
						</div>
					))}
					<Button as="link" href="/">
						Go to Home
					</Button>
				</>
			)}
		</section>
	);
}
