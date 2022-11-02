import { Link, useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { useAuthStore } from '../store';
import altogic from '../lib/altogic';
import ShowApiError from '../components/ShowApiError';

export default function Login() {
	const emailRef = useRef(null);
	const passwordRef = useRef(null);
	const [error, setError] = useState(null);

	const { setUser, setSession } = useAuthStore();
	const navigate = useNavigate();

	const login = async (email, password) => {
		setError(null);
		const { user, session, errors } = await altogic.auth.signInWithEmail(email, password);
		if (!errors) {
			setUser(user);
			setSession(session);
			navigate(`/${user.username}`);
		} else {
			setError(errors.items);
		}
	};
	const handleSubmit = async e => {
		e.preventDefault();
		const email = emailRef.current.value.trim();
		const password = passwordRef.current.value.trim();
		await login(email, password);
	};

	return (
		<div className="flex justify-center">
			<main className="relative pt-8 flex w-full md:py-lg md:px-2xl lg:p-12 lg:w-2/3 justify-center">
				<div className="p-lg pt-16 lg:!pt-24 w-full lg:w-[600px]">
					<div className="md:container mx-auto">
						<div className="mb-2xl">
							<h1 className="text-black text-[32px] tracking-[-1px] lg:tracking-[-2px] lg:text-[3rem] font-extrabold leading-heading mb-4">
								Login to your account
							</h1>
						</div>
						<ShowApiError error={error} />
						<form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col gap-2">
							<div className="rounded-[10px] relative focus-within:ring-2 focus-within:ring-black transition ease-out duration-75 hover:shadow-[inset_0_0_0_2px_#e0e2d9] hover:focus-within:shadow-none">
								<div className="flex rounded-[10px] leading-[48px] border-solid border-2 border-transparent">
									<div className="relative grow">
										<input
											ref={emailRef}
											placeholder="Email"
											name="email"
											type="email"
											autoComplete="email"
											required
											className="input peer"
										/>
									</div>
								</div>
							</div>
							<div className="rounded-[10px] relative focus-within:ring-2 focus-within:ring-black transition ease-out duration-75 hover:shadow-[inset_0_0_0_2px_#e0e2d9] hover:focus-within:shadow-none">
								<div className="flex rounded-[10px] leading-[48px] border-solid border-2 border-transparent">
									<div className="relative grow">
										<input
											ref={passwordRef}
											placeholder="Password"
											autoComplete="new-password"
											name="password"
											type="password"
											required
											className="peer input"
										/>
									</div>
								</div>
							</div>
							<div className="w-full mt-2">
								<button className="submit-btn" type="submit">
									<span className="flex justify-center items-center">
										<span className="block font-semibold text-md">Login to your account </span>
									</span>
								</button>
							</div>
						</form>
					</div>
					<p className="text-black text-sm mt-4 text-center">
						Don't have an account?{' '}
						<Link
							to="/register"
							className="text-pansy inline-flex focus-visible:outline focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-2 underline"
						>
							Create one
						</Link>
					</p>
				</div>
			</main>
		</div>
	);
}
