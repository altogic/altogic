<script>
	import { sessionStore } from '../store/auth.store';
	import { altogic } from '../configs/altogic';
	import { onMount } from 'svelte';

	let sessions = [];

	const logoutSession = async (session) => {
		const { errors } = await altogic.auth.signOut(session.token);
		if (!errors) {
			sessions = sessions.filter((s) => s.token !== session.token);
		}
	};

	const getAllSessions = async () => {
		const { sessions: sessionList } = await altogic.auth.getAllSessions();

		sessions = sessionList.map((session) =>
			session.token === $sessionStore.token ? { ...session, isCurrent: true } : session
		);
	};

	onMount(() => {
		getAllSessions();
	});
</script>

<div class="border p-4 space-y-4">
	<p class="text-3xl">All Sessions</p>
	<ul class="flex flex-col gap-2">
		{#each sessions as session}
			<li class="flex justify-between gap-12">
				<div>
					{#if session.isCurrent}<span> Current Session </span>{/if}
					<span>
						<strong>Device name: </strong>
						{session?.userAgent.device.family}
					</span>
				</div>
				<div class="flex items-center gap-2">
					<span>
						{new Date(session.creationDtm).toLocaleDateString('en-US')}
					</span>
					{#if !session.isCurrent}
						<button
							class="border grid place-items-center p-2 h-8 w-8 aspect-square leading-none"
							on:click={() => logoutSession(session)}
						>
							X
						</button>
					{/if}
				</div>
			</li>
		{/each}
	</ul>
</div>
