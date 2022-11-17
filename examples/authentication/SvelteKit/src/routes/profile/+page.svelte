<script>
	import { authStore, sessionStore } from '../../store/auth.store';
	import { altogic } from '../../configs/altogic';
	import UserInfo from '../../components/UserInfo.svelte';
	import Avatar from '../../components/Avatar.svelte';
	import Sessions from '../../components/Sessions.svelte';

	async function handleSignOut() {
		try {
			const { errors: apiErrors } = await altogic.auth.signOut();

			if (apiErrors) {
				throw apiErrors;
			}

			authStore.set(null);
			sessionStore.set(null);
			window.location.href = '/';
		} catch (err) {
			console.error(err);
		}
	}
</script>

<section class="h-screen py-4 space-y-4 flex flex-col text-center items-center">
	<Avatar />
	<UserInfo />
	<Sessions />
	<button
		class="border py-2 px-3 border-gray-500 hover:bg-gray-500 hover:text-white transition shrink-0"
		on:click={handleSignOut}
	>
		Sign Out
	</button>
</section>
