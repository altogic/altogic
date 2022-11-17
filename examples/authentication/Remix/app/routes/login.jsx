import { Form, Link, useActionData, useTransition } from '@remix-run/react';
import { createUserSession, requireNoAuth } from '~/utils/auth.server';
import { json } from '@remix-run/node';
import altogic from '~/libs/altogic';

export async function loader({ request }) {
	await requireNoAuth(request);
	return json({});
}

export async function action({ request }) {
	const formData = await request.formData();
	const { email, password } = Object.fromEntries(formData);
	const { session, errors } = await altogic.auth.signInWithEmail(email, password);

	if (errors) {
		return json({ errors });
	}

	altogic.auth.setSession(session);
	return createUserSession(session.token, '/profile');
}

export default function Login() {
	const transition = useTransition();
	const actionData = useActionData();
	const busy = transition.state === 'submitting';

	return (
		<section className="flex flex-col items-center justify-center h-96 gap-4">
			<Form method="post" className="flex flex-col gap-2 w-full md:w-96">
				<h1 className="self-start text-3xl font-bold">Login to your account</h1>
				{actionData?.errors && (
					<div className="bg-red-600 text-white text-[13px] p-2">
						{actionData.errors?.items?.map((error, index) => (
							<p key={index}>{error.message}</p>
						))}
					</div>
				)}

				<input name="email" type="email" placeholder="Type your email" required />
				<input name="password" type="password" placeholder="Type your password" required />
				<div className="flex justify-between gap-4">
					<Link className="text-indigo-600" to="/register">
						Don't have an account? Register now
					</Link>
					<button
						disabled={!!busy}
						type="submit"
						className="border py-2 px-3 border-gray-500 hover:bg-gray-500 hover:text-white transition shrink-0"
					>
						Login
					</button>
				</div>
			</Form>
		</section>
	);
}
