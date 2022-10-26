import { useFriendStore, useGroupStore } from '../../store';
import { useMemo, useState } from 'react';
import { CreateGroupDrawer, Drawer, Input, InviteUserDrawer, Loading, UserAvatar } from '../index';
import { SearchIcon } from '../icon';
import peopleSvg from '../../assets/img/people.svg';
import { GroupController } from '../../controllers';
import { useNavigate } from 'react-router-dom';
import { dispatchESCPress } from '../../helpers';

interface CreateChatDrawerProps {
	isOpen: boolean;
	close: () => void;
}
export default function CreateChatDrawer({ close, isOpen }: CreateChatDrawerProps) {
	const { friends } = useFriendStore();
	const [isGroupSectionOpen, setIsGroupSectionOpen] = useState(false);
	const [isInviteSectionOpen, setIsInviteSectionOpen] = useState(false);
	const [search, setSearch] = useState('');

	const filteredFriends = useMemo(() => {
		if (search.trim().length === 0) return friends;
		return friends.filter(
			friend =>
				friend?.friend?.name?.toLowerCase().includes(search.toLowerCase()) ||
				friend?.friend?.email?.toLowerCase().includes(search.toLowerCase())
		);
	}, [search, friends]);

	return (
		<>
			<Drawer from="left" isOpen={isOpen} close={close} title="New chat">
				<div className="bg-background-default-light dark:bg-background-default-dark">
					<div className="w-full border-b border-b-border-stronger-light px-2 py-2 dark:border-b-border-stronger-dark">
						<div className="relative flex h-[35px] items-center rounded-lg bg-search-input-background-light pl-8 pr-2 dark:bg-search-input-background-dark">
							<SearchIcon className="absolute left-3" />
							<Input
								onChange={e => setSearch(e.target.value)}
								value={search}
								type="text"
								className="h-[35px] border-none bg-transparent text-[14px] text-primary-light dark:text-primary-dark"
								placeholder="Search in people"
							/>
						</div>
					</div>
					<div className="flex flex-col">
						<div className="border-b border-b-background-default-hover-light dark:border-b-background-default-hover-dark">
							{filteredFriends?.length > 0 && (
								<CreateChatDrawer.Avatar
									onClick={() => setIsGroupSectionOpen(true)}
									name="New group"
									image={peopleSvg}
								/>
							)}

							<CreateChatDrawer.Avatar
								onClick={() => setIsInviteSectionOpen(true)}
								name="Invite friends"
								image={peopleSvg}
							/>
						</div>
						<div className="mt-4 px-4 text-sm font-medium text-text-secondary-lighter-light dark:text-text-secondary-lighter-dark">
							{filteredFriends?.length > 0 ? (
								<span>Your friends</span>
							) : (
								<div className="text-center text-lg">
									No friends found
									<br />
									you can invite your friend
								</div>
							)}
						</div>
						<div>
							{filteredFriends?.map(friend => (
								<CreateChatDrawer.Avatar
									userId={friend.friend._id}
									key={friend._id}
									showBorder
									image={friend.friend.profilePicture}
									name={friend.friend.name}
								/>
							))}
						</div>
					</div>
				</div>
			</Drawer>
			<CreateGroupDrawer isOpen={isGroupSectionOpen} close={() => setIsGroupSectionOpen(false)} />
			<InviteUserDrawer isOpen={isInviteSectionOpen} close={() => setIsInviteSectionOpen(false)} />
		</>
	);
}

interface AvatarProps {
	name?: string;
	image?: string;
	showBorder?: boolean;
	userId?: string;
	onClick?: () => void;
	className?: string;
}
CreateChatDrawer.Avatar = function Avatar({ name, image, showBorder, userId, onClick, className }: AvatarProps) {
	const navigate = useNavigate();
	const { groups } = useGroupStore();
	const [loading, setLoading] = useState(false);

	const onClickHandler = async () => {
		if (!userId) return;
		const chat = groups.find(chat => chat.members.some(member => member._id === userId));
		if (chat) {
			navigate(`/group/${chat.group._id}`);
		} else {
			setLoading(true);
			const group = await GroupController.createGroupWithParticipants('private chat', [userId], true);
			setLoading(false);
			if (group) navigate(`/group/${group._id}`);
		}
		dispatchESCPress();
	};

	return (
		<section
			onClick={onClick ?? onClickHandler}
			className={`relative grid h-[72px] max-h-[72px] w-full cursor-pointer grid-cols-[77px_1fr] grid-rows-1 transition hover:bg-background-default-hover-light dark:hover:bg-background-default-hover-dark ${
				className ?? ''
			} `}
		>
			<div className="relative flex w-[77px] shrink-0 items-center justify-center px-[13px]">
				<UserAvatar className="[&:first-child]:w-[49px]" image={image} name={name} />
				{loading && (
					<div className="absolute inset-0 m-auto flex aspect-square w-[49px] items-center justify-center rounded-full bg-black/80">
						<Loading className="h-10 w-10 text-drawer-header-title-light" />
					</div>
				)}
			</div>
			<div
				className={`flex flex-col justify-center ${
					showBorder
						? 'border-b border-b-background-default-hover-light dark:border-b-background-default-hover-dark'
						: ''
				}`}
			>
				<div className="text-base font-medium">{name}</div>
			</div>
		</section>
	);
};
