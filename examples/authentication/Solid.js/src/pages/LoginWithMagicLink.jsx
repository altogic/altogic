import { A } from '@solidjs/router';
import { batch, createSignal, For } from 'solid-js';
import altogic from '../libs/altogic';

export default function LoginWithMagicLink() {
	const [email, setEmail] = createSignal('');
	const [isDone, setIsDone] = createSignal(false);
	const [loading, setLoading] = createSignal(false);
	const [errors, setErrors] = createSignal(null);

	const submitHandler = async e => {
		e.preventDefault();

		batch(() => {
			setIsDone(false);
			setLoading(true);
			setErrors(null);
		});

		const { errors: apiErrors } = await altogic.auth.sendMagicLinkEmail(email());
		setLoading(false);

		if (apiErrors) {
			return setErrors(apiErrors);
		}

		setIsDone(true);
		setEmail('');
	};

	return (
		<section class="flex flex-col items-center justify-center h-96 gap-4">
			<form onSubmit={submitHandler} class="flex flex-col gap-2 w-full md:w-96">
				<h1 class="self-start text-3xl font-bold">Login with magic link</h1>

				{isDone() && (
					<div class="bg-green-600 text-white text-[13px] p-2">
						We have sent you a magic link. Please check your email.
					</div>
				)}

				{errors() && (
					<div class="bg-red-600 text-white text-[13px] p-2">
						<For each={errors().items}>{error => <p>{error.message}</p>}</For>
					</div>
				)}

				<input
					value={email()}
					onInput={e => setEmail(e.target.value)}
					name="email"
					type="email"
					placeholder="Type your email"
					required
				/>
				<div class="flex justify-between gap-4 items-start">
					<A href="/register" class="text-indigo-600">
						Don't have an account? Register now
					</A>
					<button
						disabled={loading()}
						type="submit"
						class="border py-2 px-3 border-gray-500 hover:bg-gray-500 hover:text-white transition shrink-0"
					>
						Send magic link
					</button>
				</div>
			</form>
		</section>
	);
}
