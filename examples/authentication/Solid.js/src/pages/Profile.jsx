import Avatar from '../components/Avatar';
import UserInfo from '../components/UserInfo';
import Sessions from '../components/Sessions';
import { useAuth } from '../context/AuthContext';
import altogic from '../libs/altogic';
import { useNavigate } from '@solidjs/router';

export default function Profile() {
	const [, { setUser, setSession }] = useAuth();
	const navigate = useNavigate();
	const logout = async () => {
		await altogic.auth.signOut();
		setUser(null);
		setSession(null);
		navigate('/login');
	};

	return (
		<div>
			<section class="h-screen py-4 space-y-4 flex flex-col text-center items-center">
				<Avatar />
				<UserInfo />
				<Sessions />
				<button onClick={logout} class="bg-gray-400 rounded py-2 px-3 text-white">
					Logout
				</button>
			</section>
		</div>
	);
}
