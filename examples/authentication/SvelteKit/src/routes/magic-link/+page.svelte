<script>
	import { altogic } from '../../configs/altogic';

	let loading = false;
	let success = '';
	let errors = null;

	async function loginHandler(e) {
		e.preventDefault();
		const [email] = e.target;
		loading = true;
		errors = null;

		const { errors: apiErrors } = await altogic.auth.sendMagicLinkEmail(email.value);
		loading = false;

		if (apiErrors) {
			errors = apiErrors.items;
		} else {
			email.value = '';
			success = 'Email sent! Check your inbox.';
		}
	}
</script>

<section class="flex flex-col items-center justify-center h-96 gap-4">
	<form class="flex flex-col gap-2 w-full md:w-96" on:submit={loginHandler}>
		<h1 class="self-start text-3xl font-bold">Login with magic link</h1>
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

		<input type="email" placeholder="Type your email" />
		<div class="flex justify-between gap-4">
			<a class="text-indigo-600" href="/sign-up">Don't have an account? Register now</a>
			<button
				disabled={loading}
				type="submit"
				class="border py-2 px-3 border-gray-500 hover:bg-gray-500 hover:text-white transition shrink-0"
			>
				Send magic link
			</button>
		</div>
	</form>
</section>
