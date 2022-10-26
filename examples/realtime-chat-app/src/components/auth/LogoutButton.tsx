import { logout } from '../../helpers/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Loading } from '../index';
import { FiLogOut } from 'react-icons/fi';
import { useAuthStore } from '../../store';

interface LogoutProps {
	className?: string;
	onlyIcon?: boolean;
}
export default function LogoutButton({ className, onlyIcon }: LogoutProps) {
	const [loading, setLoading] = useState(false);
	const { reset } = useAuthStore();
	const navigate = useNavigate();

	const clickHandler = async () => {
		setLoading(true);
		const { errors } = await logout();
		setLoading(false);
		if (!errors) {
			reset();
			navigate('/login');
		}
	};

	return (
		<Button className={className} onClick={clickHandler} withIcon={onlyIcon}>
			{loading ? <Loading className="aspect-square h-8 w-8" /> : onlyIcon ? <FiLogOut size={20} /> : 'Logout'}
		</Button>
	);
}
