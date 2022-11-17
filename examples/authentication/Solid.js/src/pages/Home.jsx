import { A } from '@solidjs/router';

export default function Home() {
	return (
		<div class="flex items-center justify-center gap-4 h-screen">
			<A href="/login-with-magic-link" class="border px-4 py-2 font-medium text-xl">
				Login With Magic Link
			</A>
			<A href="/login" class="border px-4 py-2 font-medium text-xl">
				Login
			</A>
			<A href="/register" class="border px-4 py-2 font-medium text-xl">
				Register
			</A>
		</div>
	);
}
