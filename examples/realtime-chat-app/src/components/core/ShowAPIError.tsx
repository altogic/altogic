import { APIError } from 'altogic';

interface ShowAPIErrorProps {
	error: APIError | null;
}

export default function ShowAPIError({ error }: ShowAPIErrorProps) {
	return (
		<div className="bg-red-500 p-2 text-white">
			{error?.items.map((e, index) => (
				<p key={index}>{e.message}</p>
			))}
		</div>
	);
}
