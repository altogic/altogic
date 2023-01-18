import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/auth';
import { useRef, useState, FormEvent } from 'react';
import { APIError } from 'altogic';
import altogic from '../../libs/altogic';
import { User } from '../../types/altogic';
import ShowApiError from '../../components/ShowApiError';
import Input from '../../components/ui/Input';

export default function Register() {
	const { setUser, setSession } = useAuthStore();
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const usernameRef = useRef<HTMLInputElement>(null);
	const [errors, setErrors] = useState<APIError | null>(null);
	const [isNeedToVerify, setIsNeedToVerify] = useState(false);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!emailRef.current || !passwordRef.current || !usernameRef.current) return;
		const email = emailRef.current.value.trim();
		const password = passwordRef.current.value.trim();
		const name = usernameRef.current.value.trim();
		await register(email, password, name);
	};

	const register = async (email: string, password: string, name: string) => {
		setErrors(null);
		setLoading(true);

		const { user, session, errors } = await altogic.auth.signUpWithEmail(email, password, name);
		setLoading(false);

		if (errors) {
			return setErrors(errors);
		}

		resetFields();

		if (!session) {
			return setIsNeedToVerify(true);
		}

		setUser(user as User);
		setSession(session);
		navigate('/');
	};

	function resetFields() {
		if (!emailRef.current || !passwordRef.current || !usernameRef.current) return;
		emailRef.current.value = '';
		passwordRef.current.value = '';
		usernameRef.current.value = '';
	}

	return (
		<div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-lg space-y-4">
				<h1 className="text-center text-2xl font-bold text-indigo-600 sm:text-3xl">Get started today</h1>
				<ShowApiError errors={errors} />
				{isNeedToVerify ? (
					<div className="bg-green-500 text-sm p-4 text-white rounded m-0.5 mb-2 min-h-12 gap-2 flex flex-col rounded-[0.5rem]">
						Your account has been created. Please check your email to verify your account.
					</div>
				) : null}
				<form onSubmit={handleSubmit} className="mb-0 space-y-4 rounded-lg p-8 shadow-2xl">
					<p className="text-2xl font-medium">Create an account</p>
					<div>
						<label htmlFor="name" className="text-sm font-medium">
							Your Name
						</label>

						<div className="relative mt-1">
							<Input type="text" id="name" ref={usernameRef} placeholder="Enter name" required />
						</div>
					</div>
					<div>
						<label htmlFor="email" className="text-sm font-medium">
							Email
						</label>

						<div className="relative mt-1">
							<Input type="email" id="email" ref={emailRef} placeholder="Enter email" required />
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
								ref={passwordRef}
								placeholder="Enter password"
								required
							/>
						</div>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="block w-full transition enabled:active:translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
					>
						Sign up
					</button>
					<p className="text-center text-sm text-gray-500">
						Already have an account ?{' '}
						<Link className="underline" to="/auth/login">
							Sign in
						</Link>
					</p>
				</form>
			</div>
		</div>
	);
}
