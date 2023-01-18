import useAuthStore from '../store/auth';
import { User } from '../types/altogic';
import { cn } from '../helpers';

interface UserAvatarProps {
	width?: number;
	user?: User;
	className?: string;
}
export default function UserAvatar({ user, className, width }: UserAvatarProps) {
	const { user: loggedInUser } = useAuthStore();
	const currentUser = user ?? loggedInUser;
	if (!currentUser) throw new Error('User not found');
	const style = width
		? {
				width: `${width}px`,
				height: `${width}px`,
				fontSize: `${width / 2}px`
		  }
		: {};
	if (currentUser?.profilePicture) {
		return (
			<img
				style={style}
				className={cn('rounded-full object-cover', !width ? 'w-12 h-12 text-xl' : '', className)}
				src={currentUser.profilePicture}
				alt={currentUser.name}
			/>
		);
	}
	return (
		<div
			className={cn(
				'flex items-center justify-center font-barlow leading-none tabular-nums text-white aspect-square gap-0.5 rounded-full bg-indigo-900',
				!width ? 'w-12 text-xl' : '',
				className
			)}
			style={style}
		>
			{currentUser.name
				?.split(' ')
				.slice(0, 2)
				?.map((char, index) => (
					<span key={index}>{char[0]}</span>
				))}
		</div>
	);
}
