import { useAuth } from '../context/AuthContext';
import { createSignal } from 'solid-js';
import altogic from '../libs/altogic';

export default function UserInfo() {
	let input;
	const [{ user }, { setUser }] = useAuth();
	const [changeMode, setChangeMode] = createSignal(false);

	const openChangeMode = () => {
		setChangeMode(true);
		input.focus();
	};

	const saveName = async e => {
		if (e.key !== 'Enter') return;
		const { data, errors } = await altogic.db.model('users').object(user._id).update({ name: e.target.value });
		if (errors) throw errors;
		setUser(data);
		setChangeMode(false);
	};

	return (
		<section class="border p-4 w-full">
			{changeMode() ? (
				<div class="flex items-center justify-center">
					<input
						ref={input}
						value={user.name}
						onKeyPress={saveName}
						type="text"
						name="name"
						class="text-3xl text-center"
					/>
				</div>
			) : (
				<div class="space-y-4">
					<h1 class="text-3xl">Hello, {user?.name}</h1>
					<button onClick={openChangeMode} class="border p-2">
						Change name
					</button>
				</div>
			)}
		</section>
	);
}
