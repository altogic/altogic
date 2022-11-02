import { useAuthStore } from '../store';
import { FiLogOut } from 'react-icons/fi';
import altogic from '../lib/altogic';
import { useState } from 'react';
import LoadingIcon from './LoadingIcon';

export default function LogoutButton({ className }) {
	const [loading, setLoading] = useState(false);
	const { reset } = useAuthStore();
	const logout = async () => {
		setLoading(true);
		await altogic.auth.signOut();
		reset();
		setLoading(false);
	};
	return (
		<button
			className={`bg-[#f0f0f0] text-black rounded-full w-[40px] h-[40px] grid place-items-center ${
				className ?? ''
			}`}
			onClick={logout}
		>
			{loading ? <LoadingIcon className="text-black w-6 h-6" /> : <FiLogOut size={20} />}
		</button>
	);
}
