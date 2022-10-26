interface UserAvatarProps {
	image?: string;
	name?: string;
	className?: string;
	status?: string;
	onClick?: () => void;
	showName?: boolean;
}

export default function UserAvatar({ image, name, className, status, onClick, showName, ...props }: UserAvatarProps) {
	return (
		<div
			onClick={onClick}
			className={`group flex cursor-pointer items-center gap-4 rounded-full text-primary-strong-light transition dark:text-primary-strong-dark 
				${
					showName && name
						? 'pr-6 hover:bg-menu-bar-item-background-active-light dark:hover:bg-menu-bar-item-background-active-dark'
						: ''
				}
				${className ?? ''}
			`}
		>
			<div
				className={`image-container flex aspect-square w-14 items-center justify-center overflow-hidden rounded-full transition`}
				{...props}
			>
				<img
					src={image || `https://ui-avatars.com/api/?name=${name}&background=0D8ABC&color=fff`}
					alt={name ?? 'none'}
					draggable="false"
					className="h-full w-full object-cover"
				/>
			</div>
			{showName &&
				(status ? (
					<div className="flex select-none flex-col">
						<span className="block max-w-[15ch] overflow-hidden text-ellipsis">{name}</span>
						<span className="text-[13px] font-medium text-primary-light dark:text-primary-dark">
							{status}
						</span>
					</div>
				) : (
					<span className="select-none font-medium md:line-clamp-1">{name}</span>
				))}
		</div>
	);
}
