import { Link, useActionData, useFetcher } from '@remix-run/react';
import altogic from '~/libs/altogic';
import { json } from '@remix-run/node';
import { useRef, useEffect } from 'react';

export async function action({ request }) {
	const formData = await request.formData();
	const email = formData.get('email');
	const { errors } = await altogic.auth.sendMagicLinkEmail(email);
	return json({ errors });
}

export default function LoginWithMagicLink() {
	const actionData = useActionData();
	const fetcher = useFetcher();
	const formRef = useRef(null);
	const isDone = !actionData?.errors && fetcher.type === 'done';

	useEffect(() => {
		if (isDone) formRef.current?.reset();
	}, [isDone]);

	return (
		<section className="flex flex-col items-center justify-center h-96 gap-4">
			<fetcher.Form ref={formRef} method="post" className="flex flex-col gap-2 w-full md:w-96">
				<h1 className="self-start text-3xl font-bold">Login with magic link</h1>

				{isDone && (
					<div className="bg-green-600 text-white text-[13px] p-2">
						We have sent you a magic link. Please check your email.
					</div>
				)}

				{actionData?.errors && (
					<div className="bg-red-600 text-white text-[13px] p-2">
						{actionData.errors?.items?.map((error, index) => (
							<p key={index}>{error.message}</p>
						))}
					</div>
				)}

				<input name="email" type="email" placeholder="Type your email" required />
				<div className="flex justify-between gap-4 items-start">
					<Link to="/register" className="text-indigo-600">
						Don't have an account? Register now
					</Link>
					<button
						type="submit"
						className="border py-2 px-3 border-gray-500 hover:bg-gray-500 hover:text-white transition shrink-0"
					>
						Send magic link
					</button>
				</div>
			</fetcher.Form>
		</section>
	);
}
