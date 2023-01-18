import { useEffect } from 'react';
import useAuthStore from '../../store/auth';

export default function Logout() {
	const { logout } = useAuthStore();
	useEffect(() => {
		logout();
	}, []);

	return <></>;
}
