import { A, useLocation, useNavigate, useSearchParams } from '@solidjs/router';
import { createSignal, For, onMount } from 'solid-js';
import altogic from '../libs/altogic';
import { useAuth } from '../context/AuthContext';

export default function AuthRedirect() {
	const { access_token } = useLocation().query;
	const navigate = useNavigate();
	const [errors, setErrors] = createSignal(null);
	const [, { setUser, setSession }] = useAuth();

	onMount(() => {
		altogic.auth.getAuthGrant(access_token).then(({ user, session, errors: apiErrors }) => {
			if (apiErrors) {
				return setErrors(apiErrors);
			}

			setUser(user);
			setSession(session);
			navigate('/profile');
		});
	});

	return (
		<section class="h-screen flex flex-col gap-4 justify-center items-center">
			{errors() ? (
				<div class="text-center">
					<For each={errors().items}>{error => <p class="text-red-500 text-3xl">{error.message}</p>}</For>
				</div>
			) : (
				<div class="text-center">
					<p class="text-6xl">Please wait</p>
					<p class="text-3xl">You're redirecting to your profile...</p>
				</div>
			)}
		</section>
	);
}
