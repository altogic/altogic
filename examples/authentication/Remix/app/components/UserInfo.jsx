import { useEffect, useState } from 'react';
import { useActionData, useFetcher } from '@remix-run/react';

export default function UserInfo({ user }) {
	const fetcher = useFetcher();
	const [changeMode, setChangeMode] = useState(false);
	const actionData = useActionData();

	const openChangeMode = () => {
		setChangeMode(true);
	};

	useEffect(() => {
		if (fetcher.type === 'done') setChangeMode(false);
	}, [fetcher]);

	return (
		<section className="border p-4 w-full">
			{actionData?.name}
			{changeMode ? (
				<fetcher.Form method="post" action="/api/update-user" className="flex items-center justify-center">
					<input defaultValue={user.name} type="text" name="name" className="text-3xl text-center" />
				</fetcher.Form>
			) : (
				<div className="space-y-4">
					<h1 className="text-3xl">Hello, {user?.name}</h1>
					<button onClick={openChangeMode} className="border p-2">
						Change name
					</button>
				</div>
			)}
		</section>
	);
}
