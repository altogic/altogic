import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import altogic from '~/libs/altogic';
import { createUserSession } from '~/utils/auth.server';

export async function loader({ request }) {
	const url = new URL(request.url);
	const accessToken = url.searchParams.get('access_token');

	const { session, errors } = await altogic.auth.getAuthGrant(accessToken);
	if (errors) return json({ errors });
	await createUserSession(session.token, '/profile');
}

export default function AuthRedirect() {
	const { errors } = useLoaderData();
	return (
		<section className="h-screen flex flex-col gap-4 justify-center items-center">
			{errors && (
				<div className="text-center">
					{errors.items?.map((error, index) => (
						<p className="text-red-500 text-3xl" key={index}>
							{error.message}
						</p>
					))}
				</div>
			)}
		</section>
	);
}
