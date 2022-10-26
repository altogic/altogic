import { useId, useRef, useState, FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ShowAPIError, Input } from '../../components/';
import { register, registerWithAcceptInvite } from '../../helpers/auth';
import { APIError } from 'altogic';
import { useAuthStore } from '../../store';

export default function Register() {
	const email = useRef<HTMLInputElement>(null);
	const name = useRef<HTMLInputElement>(null);
	const password = useRef<HTMLInputElement>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<APIError | null>(null);
	const [isShowNotify, setIsShowNotify] = useState(false);
	const { setUser, setSession } = useAuthStore();

	const [searchParams] = useSearchParams();

	const nameID = useId();
	const emailID = useId();
	const passwordID = useId();

	const onSubmitHandler = async (e: FormEvent) => {
		e.preventDefault();
		setError(null);
		if (!name.current || !email.current || !password.current) return;

		setLoading(true);
		setError(null);
		const inviteToken = searchParams.get('inviteToken');
		const { user, session, errors } = inviteToken
			? await registerWithAcceptInvite({
					name: name.current.value,
					email: email.current.value,
					password: password.current.value,
					inviteToken,
			  })
			: await register(email.current.value, password.current.value, name.current.value);
		setLoading(false);

		email.current.value = password.current.value = name.current.value = '';

		if (errors) {
			setError(errors);
			return;
		}

		if (!session) {
			setIsShowNotify(true);
			return;
		}

		if (user && session) {
			setUser(user);
			setSession(session);
			window.location.replace('/');
		}
	};

	return (
		<div className="flex h-screen flex-col items-center justify-center px-4">
			<form className="grid w-full max-w-sm gap-4 rounded bg-white p-6 shadow-lg" onSubmit={onSubmitHandler}>
				<h1 className="py-2 text-center text-2xl font-medium text-black">Sign-Up</h1>
				{isShowNotify && (
					<div className="bg-green-500 p-2 text-center text-white">
						Your account has been created. Please check your email to verify your account.
					</div>
				)}
				{error && <ShowAPIError error={error} />}
				<div className="input-group">
					<label className="mb-1 block text-sm font-medium text-gray-700" htmlFor={nameID}>
						Your Name
					</label>
					<Input id={nameID} ref={name} type="text" required={true} />
				</div>
				<div className="input-group">
					<label className="mb-1 block text-sm font-medium text-gray-700" htmlFor={emailID}>
						Email
					</label>
					<Input id={emailID} ref={email} type="email" required={true} />
				</div>
				<div className="input-group">
					<label className="mb-1 block text-sm font-medium text-gray-700" htmlFor={passwordID}>
						Password
					</label>
					<Input autoComplete="new-password" id={passwordID} ref={password} type="password" required={true} />
				</div>
				<div className="flex items-center justify-between">
					<Link to="/login" className="text-text-muted-light">
						Already have an account? <br /> <span className="text-black">Sign in now.</span>
					</Link>
					<button
						className="rounded border border-gray-400 px-4 py-2 text-gray-700 transition-all hover:border-gray-700 hover:ring-2 hover:ring-gray-700 active:translate-y-1"
						type="submit"
						disabled={loading}
					>
						{loading ? 'Processing...' : 'Register'}
					</button>
				</div>
			</form>
		</div>
	);
}
