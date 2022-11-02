import { Link, useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import altogic from '../lib/altogic';
import { useAuthStore } from '../store';
import ShowApiError from '../components/ShowApiError';

export default function Register() {
	const { setUser, setSession } = useAuthStore();
	const navigate = useNavigate();
	const emailRef = useRef(null);
	const passwordRef = useRef(null);
	const usernameRef = useRef(null);
	const [error, setError] = useState(null);

	const handleSubmit = async e => {
		e.preventDefault();
		const email = emailRef.current.value.trim();
		const password = passwordRef.current.value.trim();
		const username = usernameRef.current.value.trim();
		await register({ email, password, username });
	};
	const register = async ({ email, password, username }) => {
		setError(null);
		const { user, session, errors } = await altogic.auth.signUpWithEmail(email, password, {
			username,
		});
		if (!errors) {
			setUser(user);
			setSession(session);
			navigate(`/${user.username}`);
		} else {
			setError(errors.items);
		}
	};

	return (
		<div className="flex justify-center">
			<main className="relative pt-8 flex w-full md:py-lg md:px-2xl lg:p-12 lg:w-2/3 justify-center">
				<div className="p-lg pt-16 lg:!pt-24 w-full lg:w-[600px]">
					<div className="md:container mx-auto">
						<div className="mb-2xl">
							<h1 className="text-black text-[32px] tracking-[-1px] lg:tracking-[-2px] lg:text-[3rem] font-extrabold leading-heading mb-4">
								Create an account
							</h1>
						</div>
						<ShowApiError error={error} />
						<form onSubmit={handleSubmit} className="flex flex-col gap-2">
							<div className="rounded-[10px] relative focus-within:ring-2 focus-within:ring-black transition ease-out duration-75 hover:shadow-[inset_0_0_0_2px_#e0e2d9] hover:focus-within:shadow-none">
								<div className="flex rounded-[10px] leading-[48px] border-solid border-2 border-transparent">
									<input
										ref={emailRef}
										placeholder="Email"
										name="email"
										type="email"
										autoComplete="email"
										className="input peer grow"
										required
									/>
								</div>
							</div>
							<div className="rounded-[10px] relative focus-within:ring-2 focus-within:ring-black transition ease-out duration-75 hover:shadow-[inset_0_0_0_2px_#e0e2d9] hover:focus-within:shadow-none [&:focus-within~span]:block">
								<div className="flex rounded-[10px] leading-[48px] border-solid border-2 border-transparent">
									<input
										ref={usernameRef}
										placeholder="Username"
										name="username"
										pattern="[A-Za-z0-9]+"
										type="text"
										autoComplete="new-username"
										className="input peer grow"
										required
									/>
								</div>
							</div>
							<span className="leading-none text-[12px] text-pansy mt-1 text-right pr-1 -mt-1 hidden">
								English letters and numbers only
							</span>
							<div className="rounded-[10px] relative focus-within:ring-2 focus-within:ring-black transition ease-out duration-75 hover:shadow-[inset_0_0_0_2px_#e0e2d9] hover:focus-within:shadow-none">
								<div className="flex rounded-[10px] leading-[48px] border-solid border-2 border-transparent">
									<input
										ref={passwordRef}
										autoComplete="new-password"
										placeholder="Password"
										name="password"
										type="password"
										required
										className="peer input grow"
									/>
								</div>
							</div>
							<div className="w-full mt-2">
								<button className="submit-btn" type="submit">
									<span className="flex justify-center items-center">
										<span className="block font-semibold text-md">Create Account</span>
									</span>
								</button>
							</div>
						</form>
					</div>
					<p className="text-black text-sm mt-4 text-center">
						<Link
							to="/login"
							className="text-pansy inline-flex focus-visible:outline focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-2 underline"
						>
							Already have an account?
						</Link>
					</p>
				</div>
			</main>
		</div>
	);
}
