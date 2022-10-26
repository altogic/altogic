import { useAuthStore } from '../../store';
import { useState } from 'react';
import {
	RecentChats,
	ProfileSettingsDrawer,
	UserAvatar,
	Button,
	CreateChatDrawer,
	FriendNotifications,
	Notifications,
} from '../';
import { MessageIcon } from '../icon';

export default function ChatLeftSide() {
	return (
		<aside className="relative grid grid-rows-[auto_1fr]">
			<Header />
			<RecentChats />
		</aside>
	);
}

function Header() {
	const { user } = useAuthStore();
	const [profileSettingsOpen, setProfileSettingsOpen] = useState(false);
	const [newMessageOpen, setNewMessageOpen] = useState(false);

	return (
		<>
			<ProfileSettingsDrawer close={() => setProfileSettingsOpen(false)} isOpen={profileSettingsOpen} />
			<CreateChatDrawer isOpen={newMessageOpen} close={() => setNewMessageOpen(false)} />
			<header className="flex h-h-pane-header items-center justify-between gap-4 bg-panel-header-background-light p-4 dark:bg-panel-header-background-dark">
				<UserAvatar
					onClick={() => setProfileSettingsOpen(true)}
					image={user?.profilePicture}
					name={user?.name}
					className="[&:first-child]:w-[40px]"
				/>
				<div className="flex items-center gap-1">
					<Button
						onClick={() => setNewMessageOpen(true)}
						withIcon
						className="text-panel-header-icon-light dark:text-panel-header-icon-dark"
					>
						<MessageIcon />
					</Button>
					<FriendNotifications />
					<Notifications />
				</div>
			</header>
		</>
	);
}
