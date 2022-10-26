import { useFriendStore } from '../../store';
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { CreateChatDrawer, Drawer, Input, Checkbox, Button, Loading } from '../index';
import { SearchIcon } from '../icon';
import { GroupController } from '../../controllers';
import { useNavigate } from 'react-router-dom';
import { dispatchESCPress } from '../../helpers';

interface CreateGroupDrawerProps {
	isOpen: boolean;
	close: () => void;
}
export default function CreateGroupDrawer({ close, isOpen }: CreateGroupDrawerProps) {
	const { friends } = useFriendStore();
	const [selectedFriends, setSelectedFriends] = useState<{ [userId: string]: boolean }>({});
	const [selectedUsersId, setSelectedUsersId] = useState<string[]>([]);
	const [groupName, setGroupName] = useState('');
	const [loading, setLoading] = useState(false);
	const [search, setSearch] = useState('');
	const navigate = useNavigate();

	const filteredFriends = useMemo(() => {
		if (search.trim().length === 0) return friends;
		return friends.filter(
			friend =>
				friend?.friend?.name?.toLowerCase().includes(search.toLowerCase()) ||
				friend?.friend?.email?.toLowerCase().includes(search.toLowerCase())
		);
	}, [search, friends]);

	useEffect(() => {
		setSelectedUsersId(
			Object.entries(selectedFriends)
				.filter(([_, value]) => value)
				.map(([key]) => key)
		);
	}, [selectedFriends]);

	useEffect(() => {
		setDefaults();
		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen]);

	function setDefaults() {
		setSelectedFriends(
			friends.reduce((acc, item) => {
				return { ...acc, [item.friend._id]: false };
			}, {})
		);
	}
	const submitHandler = async (e: FormEvent) => {
		e.preventDefault();
		if (selectedUsersId.length === 0) return;
		setLoading(true);
		const group = await GroupController.createGroupWithParticipants(groupName.trim(), selectedUsersId, false);
		if (group) {
			setLoading(false);
			setGroupName('');
			setDefaults();
			dispatchESCPress();
			navigate(`/group/${group._id}`);
		}
	};
	const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
		setSelectedFriends(prev => ({ ...prev, [e.target.value]: e.target.checked }));
	};
	return (
		<Drawer from="left" isOpen={isOpen} close={close} title="New group">
			<form onSubmit={submitHandler} className="bg-background-default-light dark:bg-background-default-dark">
				<div className="w-full p-2">
					<div className="relative flex h-[35px] items-center rounded-lg bg-search-input-background-light pl-8 pr-2 dark:bg-search-input-background-dark">
						<SearchIcon className="absolute left-3" />
						<Input
							value={search}
							onChange={e => setSearch(e.target.value)}
							type="text"
							className="h-[35px] border-none bg-transparent text-[14px] text-primary-light dark:text-primary-dark"
							placeholder="Search in people"
						/>
					</div>
				</div>
				<div className="w-full border-b border-b-border-stronger-light px-2 py-2 dark:border-b-border-stronger-dark">
					<div className="relative flex h-[50px] items-center rounded-lg bg-search-input-background-light dark:bg-search-input-background-dark">
						<Input
							value={groupName}
							onChange={e => setGroupName(e.target.value)}
							type="text"
							className="h-[35px] border-none bg-transparent text-[17px] text-primary-light dark:text-primary-dark"
							placeholder="Type a group name"
							required
						/>
					</div>
				</div>
				<div className="flex flex-col gap-10">
					<div>
						{filteredFriends.map(item => (
							<Checkbox
								onChange={onChangeHandler}
								className="grid grid-cols-[auto_1fr] px-[13px]"
								value={item.friend._id}
								name={item.friend._id}
								key={item._id}
							>
								<CreateChatDrawer.Avatar
									onClick={() => {}}
									className="flex-1"
									userId={item.friend._id}
									showBorder
									image={item.friend.profilePicture}
									name={item.friend.name}
								/>
							</Checkbox>
						))}
					</div>
					<div className="px-4">
						<Button className="w-full">
							{loading ? <Loading className="h-8 w-8 text-drawer-header-title-light" /> : 'Create group'}
						</Button>
					</div>
				</div>
			</form>
		</Drawer>
	);
}
