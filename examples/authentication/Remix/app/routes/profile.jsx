import { Link, useLoaderData } from '@remix-run/react';
import { getAllSessions, getToken, getUserByToken, requireAuth } from '~/utils/auth.server';
import UserInfo from '~/components/UserInfo';
import Avatar from '~/components/Avatar';
import { json } from '@remix-run/node';
import Sessions from '~/components/Sessions';

export async function loader({ request }) {
	await requireAuth(request);
	const { user, errors: userErrors } = await getUserByToken(await getToken(request));
	const { sessions, errors: sessionErrors } = await getAllSessions(request);
	if (userErrors || sessionErrors) {
		return json(userErrors || sessionErrors, { status: 401 });
	}
	return json({ user, sessions });
}
export default function Profile() {
	const { user, sessions } = useLoaderData();
	return (
		<div>
			<section className="h-screen py-4 space-y-4 flex flex-col text-center items-center">
				<Avatar user={user} />
				<UserInfo user={user} />
				<Sessions sessions={sessions} />
				<Link to="/api/logout" className="bg-gray-400 rounded py-2 px-3 text-white">
					Logout
				</Link>
			</section>
		</div>
	);
}
