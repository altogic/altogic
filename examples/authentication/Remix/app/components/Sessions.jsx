import altogic from '~/libs/altogic';
import { useState } from 'react';

export default function Sessions({ sessions }) {
	const [sessionsList, setSessionsList] = useState(sessions);
	altogic.auth.setSession({ token: sessions.find(s => s.isCurrent).token });

	const logoutSession = async session => {
		const { errors } = await altogic.auth.signOut(session.token);
		if (!errors) {
			setSessionsList(prev => prev.filter(s => s.token !== session.token));
		}
	};

	return (
		<div className="border p-4 space-y-4">
			<p className="text-3xl">All Sessions</p>
			<ul className="flex flex-col gap-2">
				{sessionsList.map(session => (
					<li key={session.token} className="flex justify-between gap-12">
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
						<div className="flex items-center gap-2">
							<span>{new Date(session.creationDtm).toLocaleDateString('en-US')}</span>
							{!session?.isCurrent && (
								<button
									onClick={() => logoutSession(session)}
									className="border grid place-items-center p-2 h-8 w-8 aspect-square leading-none"
								>
									X
								</button>
							)}
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
