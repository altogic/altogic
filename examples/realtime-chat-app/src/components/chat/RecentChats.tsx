import { useAuthStore, useGroupStore, useUnreadMessageCountStore } from '../../store';
import { NavLink, useParams } from 'react-router-dom';
import { Dropdown, Input, Loading, UserAvatar } from '../';
import { GroupParticipant } from '../../types';
import { ArrowDownIcon, MessageIcon, SearchIcon } from '../icon';
import { useMemo, useState } from 'react';
import { GroupController } from '../../controllers';

export default function RecentChats() {
	const { groups, groupsLoading } = useGroupStore();
	const [search, setSearch] = useState('');

	const filteredGroups = useMemo(() => {
		if (search.trim().length === 0) return groups;
		const searchTerm = search.toLowerCase();
		return groups.filter(
			chat =>
				chat?.members?.[0].name?.toLowerCase().includes(searchTerm) ||
				chat?.members?.[0].email?.toLowerCase().includes(searchTerm) ||
				chat.group.name.toLowerCase().includes(searchTerm)
		);
	}, [search, groups]);

	const sortedGroups = useMemo(() => {
		return filteredGroups.sort((a, b) => {
			const aDate = new Date(a.group.lastMessageDate).getTime();
			const bDate = new Date(b.group.lastMessageDate).getTime();
			return bDate - aDate;
		});
	}, [filteredGroups]);

	return (
		<div className="flex flex-col items-center gap-3 overflow-auto bg-background-default-light dark:bg-background-default-dark md:items-start">
			<div className="flex w-full flex-1 flex-col">
				<div className="w-full border-b border-b-border-stronger-light px-2 py-2 dark:border-b-border-stronger-dark">
					<div className="relative flex h-[35px] items-center rounded-lg bg-search-input-background-light pl-8 pr-2 dark:bg-search-input-background-dark">
						<SearchIcon className="absolute left-3" />
						<Input
							onChange={e => setSearch(e.target.value)}
							value={search}
							type="text"
							className="h-[35px] border-none bg-transparent text-[14px] text-primary-light dark:text-primary-dark"
							placeholder="Search in chats"
						/>
					</div>
				</div>
				<div className="flex-1 pr-1">
					{groupsLoading ? (
						<div className="flex h-full w-full items-center justify-center">
							<Loading className="h-16 w-16 text-icon-light dark:text-icon-dark" />
						</div>
					) : groups?.length === 0 ? (
						<div className="px-2 py-3">
							<div className="w-full rounded-lg bg-blue-400 px-4 py-2 text-white">
								<div className="mb-1 text-xl font-bold">You have no chats</div>
								<span className="text-[17px]">
									You can create a new chat by clicking <MessageIcon className="inline" /> icon on the
									top!
								</span>
							</div>
						</div>
					) : (
						sortedGroups?.map(chat => <RecentChatItem chat={chat} key={chat._id} />)
					)}
				</div>
			</div>
		</div>
	);
}

interface RecentChatsProps {
	chat: GroupParticipant;
}
export function RecentChatItem({ chat }: RecentChatsProps) {
	const [deleted, setDeleted] = useState(false);
	const { user } = useAuthStore();
	const { removeGroup } = useGroupStore();
	const { groupId } = useParams();
	const { unreadMessageCount } = useUnreadMessageCountStore();

	const isGroup = useMemo(() => !chat.group.isPrivate, [chat]);
	const unreadCount = useMemo(
		() => unreadMessageCount[chat.group._id],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[unreadMessageCount]
	);
	const member = chat.members?.find(member => member._id !== user?._id);
	const name = isGroup ? chat.group.name : member?.name;
	const image = isGroup ? chat.group.profilePicture : member?.profilePicture;
	const leaveGroup = async () => {
		setDeleted(true);
		try {
			await GroupController.leaveGroup(chat.group._id);
			removeGroup(chat.group._id);
		} catch {
			alert('Something went wrong');
			setDeleted(false);
		}
	};
	const deleteChat = async () => {
		setDeleted(true);
		try {
			await GroupController.deleteGroup(chat.group._id);
		} catch {
			alert('Something went wrong');
			setDeleted(false);
		}
	};

	const groupDropdownItems = [
		{
			title: 'Exit group',
			onClick: leaveGroup,
		},
	];
	const dropdownItems = [
		{
			title: 'Delete chat',
			onClick: deleteChat,
		},
	];

	const dropdown = isGroup ? groupDropdownItems : dropdownItems;
	if (deleted) return null;

	return (
		<div className="group relative">
			<NavLink
				key={chat._id}
				className={({ isActive }) =>
					`relative grid h-[72px] max-h-[72px] w-full grid-cols-[77px_1fr] grid-rows-1 transition 
				${
					isActive
						? 'active bg-background-default-active-light dark:bg-background-default-active-dark'
						: 'hover:bg-background-default-hover-light dark:hover:bg-background-default-hover-dark'
				}
				`
				}
				to={`group/${chat.group._id}`}
			>
				<div className="flex w-[77px] shrink-0 items-center justify-center px-[13px]">
					<UserAvatar className="[&:first-child]:w-[49px]" image={image} name={name} />
				</div>
				<div className="flex items-center justify-between border-b border-b-background-default-hover-light py-4 pr-12 dark:border-b-background-default-hover-dark">
					<span className="text-base font-medium text-primary-strongest-light dark:text-primary-strongest-dark">
						{name}
					</span>
					{groupId !== chat.group._id && unreadCount > 0 && (
						<span className="flex h-[20px] w-[20px] shrink-0 grow-0 items-center justify-center rounded-full  bg-unread-marker-background-light text-[12px] tabular-nums text-unread-marker-text-light dark:bg-unread-marker-background-dark dark:text-unread-marker-text-dark">
							{unreadCount}
						</span>
					)}
				</div>
			</NavLink>
			<div className="absolute right-0 bottom-0 bottom-0 top-0 flex items-center opacity-0 transition group-hover:opacity-100">
				<Dropdown locationX="right" data={dropdown} onlyIcon>
					<ArrowDownIcon className="z-0 text-bubble-meta-icon-light dark:text-bubble-meta-icon-dark" />
				</Dropdown>
			</div>
		</div>
	);
}
