<script>
	import { afterUpdate } from 'svelte';
	import { authStore } from '../../store/auth.store';

	afterUpdate(() => {
		if ($authStore === null) {
			// Navigate to sign in, if the user has not session
			window.location.href = '/sign-in';
		}
	});
</script>

<div>
	{#if $authStore}
		<slot />
	{:else}
		<div>Loading...</div>
	{/if}
</div>
