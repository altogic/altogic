<script>
	import { authStore, sessionStore } from '../../store/auth.store';

	let loading = false;
	let success = '';
	let errors = null;

	const handleSignUp = async (e) => {
		e.preventDefault();
		const [name, email, password] = e.target;
		try {
			loading = true;

			const res = await fetch('/api/sign-up', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email: email.value,
					password: password.value,
					name: name.value
				})
			});

			const { session, errors: apiErrors, user } = await res.json();

			if (apiErrors) {
				throw apiErrors;
			}

			if (session) {
				authStore.set(user);
				sessionStore.set(session);
				window.location.href = '/profile';
			} else {
				success = `We sent a verification link to ${email.value}`;
				errors = null;
				loading = false;
				name.value = '';
				email.value = '';
				password.value = '';
			}
		} catch (err) {
			success = '';
			errors = err.items;
			loading = false;
		}
	};
</script>

<section class="flex flex-col items-center justify-center h-96 gap-4">
	<form class="flex flex-col gap-2 w-full md:w-96" on:submit={handleSignUp}>
		<h1 class="self-start text-3xl font-bold">Create an account</h1>
		{#if success}
			<div class="bg-green-600 text-white text-[13px] p-2">
				{success}
			</div>
		{/if}

		{#if errors}
			<div class="bg-red-600 text-white text-[13px] p-2">
				{#each errors as { message }}
					<p>{message}</p>
				{/each}
			</div>
		{/if}

		<input type="text" placeholder="Type your name" />
		<input type="email" placeholder="Type your email" />
		<input autoComplete="new-password" type="password" placeholder="Type your password" />
		<div class="flex justify-between gap-4">
			<a class="text-indigo-600" href="/sign-in">Already have an account?</a>
			<button
				type="submit"
				class="border py-2 px-3 border-gray-500 hover:bg-gray-500 hover:text-white transition shrink-0"
				disabled={loading}
			>
				Register
			</button>
		</div>
	</form>
</section>
