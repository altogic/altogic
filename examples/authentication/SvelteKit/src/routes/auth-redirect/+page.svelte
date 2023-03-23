<script>
	import { authStore, sessionStore } from '../../store/auth.store';
	import { onMount } from 'svelte';
	let errors = null;

	const handleToken = async () => {
		try {
			const query = new URLSearchParams(window.location.search);
			const access_token = query.get('access_token');
			const res = await fetch('/api/auth-redirect', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ access_token })
			});

			const { user, session, errors } = await res.json();

			if (errors) throw errors;

			if (user && session) {
				authStore.set(user);
				sessionStore.set(session);
				window.location.href = '/profile';
			} else {
				window.location.href = '/sign-in';
			}
		} catch (err) {
			errors = err.items;
		}
	};

	onMount(() => {
		handleToken();
	});
</script>

<div>
	{#if errors}
		<div class="bg-red-600 text-white text-[13px] p-2">
			{#each errors as { message }}
				<p>{message}</p>
			{/each}
		</div>
	{:else}
		<div class="h-screen flex items-center justify-center">Redirecting...</div>
	{/if}
</div>
