import { Link, useNavigate } from 'react-router-dom';
import { FormEvent, useRef, useState } from 'react';
import useAuthStore from '../../store/auth';
import { APIError } from 'altogic';
import ShowApiError from '../../components/ShowApiError';
import altogic from '../../libs/altogic';
import { User } from '../../types/altogic';
import Input from '../../components/ui/Input';

export default function Login() {
	const { setUser, setSession } = useAuthStore();
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const [errors, setErrors] = useState<APIError | null>(null);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const submitHandler = async (e: FormEvent) => {
		e.preventDefault();
		if (!emailRef.current || !passwordRef.current) return;
		const email = emailRef.current.value.trim();
		const password = passwordRef.current.value.trim();
		await login(email, password);
	};

	const login = async (email: string, password: string) => {
		setErrors(null);
		setLoading(true);

		const { user, session, errors } = await altogic.auth.signInWithEmail(email, password);
		setLoading(false);

		if (errors) {
			return setErrors(errors);
		}

		if (session && user) {
			setUser(user as User);
			setSession(session);
			altogic.endpoint.post('/add-access-group').then(({ data }) => setSession(data));
			navigate('/');
		}
	};

	return (
		<div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-lg space-y-4">
				<h1 className="text-center text-2xl font-bold text-indigo-600 sm:text-3xl">Get started today</h1>
				<ShowApiError errors={errors} />
				<form onSubmit={submitHandler} className="mb-0 space-y-4 rounded-lg p-8 shadow-2xl">
					<p className="text-2xl font-medium">Sign in to your account</p>
					<div>
						<label htmlFor="email" className="text-sm font-medium">
							Email
						</label>
						<div className="relative mt-1">
							<Input type="email" id="email" placeholder="Enter email" ref={emailRef} required />
						</div>
					</div>
					<div>
						<label htmlFor="password" className="text-sm font-medium">
							Password
						</label>
						<div className="relative mt-1">
							<Input
								type="password"
								id="password"
								placeholder="Enter password"
								ref={passwordRef}
								required
							/>
						</div>
					</div>
					<button
						type="submit"
						disabled={loading}
						className="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
					>
						Sign in
					</button>
					<p className="text-center text-sm text-gray-500">
						No account?{' '}
						<Link className="underline" to="/auth/register">
							Sign up
						</Link>
					</p>
				</form>
			</div>
		</div>
	);
}
