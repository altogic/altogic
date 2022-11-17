<script>
	import { authStore, sessionStore } from '../../store/auth.store';
	import { altogic } from '../../configs/altogic';
	import { onMount } from 'svelte';

	const handleToken = async () => {
		const query = new URLSearchParams(window.location.search);
		const access_token = query.get('access_token');
		const { user, session } = await altogic.auth.getAuthGrant(access_token);

		if (user) {
			authStore.set(user);
			sessionStore.set(session);
			window.location.href = '/profile';
		} else {
			window.location.href = '/sign-in';
		}
	};

	onMount(() => {
		handleToken();
	});
</script>

<div>
	<div>Redirecting...</div>
</div>
