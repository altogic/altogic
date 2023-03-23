<script>
	import altogic from '../libs/altogic.js';
	export let sessions;

	const logoutSession = async (session) => {
		const { errors } = await altogic.auth.signOut(session.token);
		if (!errors) {
			sessions = sessions.filter((s) => s.token !== session.token);
		}
	};
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
