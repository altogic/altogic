import { A, useNavigate } from '@solidjs/router';
import { batch, createSignal, For } from 'solid-js';
import altogic from '../libs/altogic';
import { useAuth } from '../context/AuthContext';

export default function Register() {
	const [name, setName] = createSignal('');
	const [email, setEmail] = createSignal('');
	const [password, setPassword] = createSignal('');
	const [errors, setErrors] = createSignal(null);
	const [loading, setLoading] = createSignal(false);
	const [needToVerify, setNeedToVerify] = createSignal(false);
	const [_, { setUser, setSession }] = useAuth();

	const navigate = useNavigate();

	const handleSubmit = async e => {
		e.preventDefault();
		setErrors(null);
		setLoading(true);
		const { errors: apiErrors, user, session } = await altogic.auth.signUpWithEmail(email(), password(), name());
		setLoading(false);

		if (apiErrors) {
			return setErrors(apiErrors);
		}

		if (!session) {
			setNeedToVerify(true);
			batch(() => {
				setName('');
				setEmail('');
				setPassword('');
			});
			return;
		}

		setUser(user);
		setSession(session);
		navigate('/profile');
	};

	return (
		<section class="flex flex-col items-center justify-center h-96 gap-4">
			<form onSubmit={handleSubmit} class="flex flex-col gap-2 w-full md:w-96">
				<h1 class="self-start text-3xl font-bold">Create an account</h1>
				{needToVerify() && (
					<div class="bg-green-500 text-white p-2">
						Your account has been created. Please check your email to verify your account.
					</div>
				)}
				{errors() && (
					<div class="bg-red-600 text-white text-[13px] p-2">
						<For each={errors().items}>{error => <p>{error.message}</p>}</For>
					</div>
				)}
				<input
					value={name()}
					onInput={e => setName(e.target.value)}
					autocomplete="given-name"
					type="text"
					placeholder="Type your name"
					required
				/>
				<input
					value={email()}
					onInput={e => setEmail(e.target.value)}
					autocomplete="email"
					type="email"
					placeholder="Type your email"
					required
				/>
				<input
					value={password()}
					onInput={e => setPassword(e.target.value)}
					type="password"
					autocomplete="new-password"
					placeholder="Type your password"
					required
				/>
				<div class="flex justify-between gap-4">
					<A class="text-indigo-600" href="/login">
						Already have an account? Login now
					</A>
					<button
						disabled={loading()}
						type="submit"
						class="border py-2 px-3 border-gray-500 hover:bg-gray-500 hover:text-white transition shrink-0"
					>
						Create account
					</button>
				</div>
			</form>
		</section>
	);
}
