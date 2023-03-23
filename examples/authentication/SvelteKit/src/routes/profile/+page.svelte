<script>
	import { authStore, sessionStore } from '../../store/auth.store';
	import UserInfo from '../../components/UserInfo.svelte';
	import Avatar from '../../components/Avatar.svelte';
	import Sessions from '../../components/Sessions.svelte';
	export let data;
</script>

<section class="h-screen py-4 space-y-4 flex flex-col text-center items-center">
	<Avatar />
	<UserInfo />
	<Sessions sessions={data.allSessions} />
	<a
		href="/api/logout"
		class="border py-2 px-3 border-gray-500 hover:bg-gray-500 hover:text-white transition shrink-0"
	>
		Sign Out
	</a>
</section>
