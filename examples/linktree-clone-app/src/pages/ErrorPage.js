import { useRouteError } from 'react-router-dom';

export default function ErrorPage() {
	const { status, data } = useRouteError();
	return (
		<section className="flex flex-col justify-center h-screen items-center">
			<h1 className="text-8xl">{status}</h1>
			<h3 className="text-xl">{data}</h3>
		</section>
	);
}
