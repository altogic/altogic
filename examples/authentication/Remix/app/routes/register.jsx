import { Form, Link, useActionData, useTransition } from '@remix-run/react';
import { json } from '@remix-run/node';
import altogic from '~/libs/altogic';
import { createUserSession, requireNoAuth } from '~/utils/auth.server';
import { useEffect, useRef } from 'react';

export async function loader({ request }) {
	await requireNoAuth(request);
	return json({});
}

export async function action({ request }) {
	const formData = await request.formData();
	const { email, password, name } = Object.fromEntries(formData);
	const { session, errors } = await altogic.auth.signUpWithEmail(email, password, name);

	if (errors) {
		return json({ errors });
	}

	if (!session) {
		return json({ needToVerify: true });
	}

	altogic.auth.setSession(session);
	return createUserSession(session.token, '/profile');
}
export default function Register() {
	const transition = useTransition();
	const actionData = useActionData();
	const busy = transition.state === 'submitting';
	const formRef = useRef(null);

	useEffect(() => {
		if (actionData?.needToVerify) {
			formRef.current?.reset();
			document.activeElement.blur();
		}
	}, [actionData]);

	return (
		<section className="flex flex-col items-center justify-center h-96 gap-4">
			<Form ref={formRef} method="post" className="flex flex-col gap-2 w-full md:w-96">
				<h1 className="self-start text-3xl font-bold">Create an account</h1>
				{actionData?.needToVerify && (
					<div className="bg-green-500 text-white p-2">
						Your account has been created. Please check your email to verify your account.
					</div>
				)}
				{actionData?.errors && (
					<div className="bg-red-600 text-white text-[13px] p-2">
						{actionData.errors?.items?.map((error, index) => (
							<p key={index}>{error.message}</p>
						))}
					</div>
				)}
				<input name="name" autoComplete="given-name" type="text" placeholder="Type your name" required />
				<input name="email" autoComplete="email" type="email" placeholder="Type your email" required />
				<input
					name="password"
					type="password"
					autoComplete="new-password"
					placeholder="Type your password"
					required
				/>
				<div className="flex justify-between gap-4">
					<Link className="text-indigo-600" to="/login">
						Already have an account? Login now
					</Link>
					<button
						disabled={!!busy}
						type="submit"
						className="border py-2 px-3 border-gray-500 hover:bg-gray-500 hover:text-white transition shrink-0"
					>
						Create account
					</button>
				</div>
			</Form>
		</section>
	);
}
