import { useId, useRef, FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { Input, ShowAPIError } from '../../components';
import { login } from '../../helpers/auth';
import { APIError } from 'altogic';
import { useAuthStore } from '../../store';

export default function Login() {
	const email = useRef<HTMLInputElement>(null);
	const password = useRef<HTMLInputElement>(null);
	const [error, setError] = useState<APIError | null>(null);
	const [loading, setLoading] = useState(false);

	const { setUser, setSession } = useAuthStore();

	const emailID = useId();
	const passwordID = useId();

	const onSubmitHandler = async (e: FormEvent) => {
		e.preventDefault();
		if (!email.current || !password.current) return;

		setError(null);
		setLoading(true);
		const { user, session, errors } = await login(email.current.value, password.current.value);
		setLoading(false);

		if (user && session) {
			setUser(user);
			setSession(session);
			window.location.replace('/');
		}
		if (errors) setError(errors);
	};

	return (
		<div className="flex h-screen flex-col items-center justify-center px-4">
			<form className="grid w-full max-w-sm gap-4 rounded bg-white p-6 shadow-lg" onSubmit={onSubmitHandler}>
				<h1 className="py-2 text-center text-2xl font-medium text-black">Sign-in</h1>
				{error && <ShowAPIError error={error} />}
				<div className="input-group">
					<label className="mb-1 block text-sm font-medium text-gray-700" htmlFor={emailID}>
						Email
					</label>
					<Input id={emailID} type="email" required={true} ref={email} />
				</div>
				<div className="input-group">
					<label className="mb-1 block text-sm font-medium text-gray-700" htmlFor={passwordID}>
						Password
					</label>
					<Input id={passwordID} type="password" required={true} ref={password} />
				</div>
				<div className="input-group flex items-center justify-between">
					<Link to="/register" className="text-text-muted-light">
						Don't you have an account? <br />
						<span className="text-black">Register now.</span>
					</Link>
					<button
						className="rounded border border-gray-400 px-4 py-2 text-gray-700 transition-all hover:border-gray-700 hover:ring-2 hover:ring-gray-700 active:translate-y-1"
						type="submit"
						disabled={loading}
					>
						{loading ? 'Processing...' : 'Login'}
					</button>
				</div>
			</form>
		</div>
	);
}
