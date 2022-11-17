import { Link } from '@remix-run/react';
import { json } from '@remix-run/node';
import { requireNoAuth } from '~/utils/auth.server';

export async function loader({ request }) {
	await requireNoAuth(request);
	return json({});
}

export default function Index() {
	return (
		<div className="flex items-center justify-center gap-4 h-screen">
			<Link to="/login-with-magic-link" className="border px-4 py-2 font-medium text-xl">
				Login With Magic Link
			</Link>
			<Link to="/login" className="border px-4 py-2 font-medium text-xl">
				Login
			</Link>
			<Link to="/register" className="border px-4 py-2 font-medium text-xl">
				Register
			</Link>
		</div>
	);
}
