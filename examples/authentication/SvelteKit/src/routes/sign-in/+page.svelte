<script>
	import { authStore, sessionStore } from '../../store/auth.store';
	import { altogic } from '../../configs/altogic';

	let loading = false;
	let errors = null;

	const handleSignIn = async (e) => {
		e.preventDefault();
		const [email, password] = e.target;
		try {
			loading = true;

			const {
				user,
				session,
				errors: apiErrors
			} = await altogic.auth.signInWithEmail(email.value, password.value);

			if (apiErrors) {
				throw apiErrors;
			}

			authStore.set(user);
			sessionStore.set(session);
			window.location.href = '/profile';
		} catch (err) {
			errors = err.items;
			loading = false;
		}
	};
</script>

<section class="flex flex-col items-center justify-center h-96 gap-4">
	<form class="flex flex-col gap-2 w-full md:w-96" on:submit={handleSignIn}>
		<h1 class="self-start text-3xl font-bold">Login to your account</h1>
		{#if errors}
			<div class="bg-red-600 text-white text-[13px] p-2">
				{#each errors as { message }}
					<p>{message}</p>
				{/each}
			</div>
		{/if}

		<input type="email" placeholder="Type your email" />
		<input autoComplete="new-password" type="password" placeholder="Type your password" />
		<div class="flex justify-between gap-4">
			<a class="text-indigo-600" href="/sign-up">Don't have an account? Register now</a>
			<button
				type="submit"
				class="border py-2 px-3 border-gray-500 hover:bg-gray-500 hover:text-white transition shrink-0"
				disabled={loading}
			>
				Login
			</button>
		</div>
	</form>
</section>
