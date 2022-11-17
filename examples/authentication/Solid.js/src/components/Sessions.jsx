import { createSignal, For, onMount } from 'solid-js';
import altogic from '../libs/altogic';
import { useAuth } from '../context/AuthContext';

export default function Sessions() {
	const [sessions, setSessions] = createSignal([]);
	const [{ session }] = useAuth();

	onMount(() => {
		altogic.auth.getAllSessions().then(({ sessions: allSessions, errors }) => {
			if (errors) throw errors;
			setSessions(allSessions.map(s => ({ ...s, isCurrent: s.token === session.token })));
		});
	});

	const logoutSession = async session => {
		const { errors } = await altogic.auth.signOut(session.token);
		if (!errors) setSessions(prev => prev.filter(s => s.token !== session.token));
	};

	return (
		<div class="border p-4 space-y-4">
			<p class="text-3xl">All Sessions</p>
			<ul class="flex flex-col gap-2">
				<For each={sessions()}>
					{session => (
						<li class="flex justify-between gap-12">
							<div>
								{session?.isCurrent ? (
									<span>Current Sessions</span>
								) : (
									<span>
										<strong>Device name: </strong>
										{session?.userAgent?.device?.family}
									</span>
								)}
							</div>
							<div class="flex items-center gap-2">
								<span>{new Date(session.creationDtm).toLocaleDateString('en-US')}</span>
								{!session?.isCurrent && (
									<button
										onClick={() => logoutSession(session)}
										class="border grid place-items-center p-2 h-8 w-8 aspect-square leading-none"
									>
										X
									</button>
								)}
							</div>
						</li>
					)}
				</For>
			</ul>
		</div>
	);
}
