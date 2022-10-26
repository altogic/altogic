import { Button, Checkbox, Modal, UserAvatar } from '../index';
import { User } from '../../types';
import { useFriendStore } from '../../store';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { CheckIcon } from '../icon';
import { GroupController } from '../../controllers';
import { useParams } from 'react-router-dom';
import altogic from '../../libs/altogic';

interface AddParticipantToGroupProps {
	isOpen: boolean;
	closeModal: () => void;
	currentMembers?: User[];
}

export default function AddParticipantToGroup({ isOpen, closeModal, currentMembers }: AddParticipantToGroupProps) {
	const { friends } = useFriendStore();
	const { groupId } = useParams();
	const [selectedFriends, setSelectedFriends] = useState<{ [userId: string]: boolean }>({});
	const [selectedUser, setSelectedUsers] = useState<User[]>([]);

	const filteredFriends = useMemo(() => {
		if (!isOpen) return [];
		return friends.filter(item => !currentMembers?.some(member => member._id === item.friend._id));
	}, [friends, currentMembers, isOpen]);

	useEffect(() => {
		// converts selected users to required format
		setSelectedUsers(
			Object.entries(selectedFriends)
				.filter(([_, value]) => value)
				.map(([key]) => friends.find(item => item.friend._id === key)?.friend as User)
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedFriends]);

	useEffect(() => {
		setDefaults();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filteredFriends, isOpen]);

	function setDefaults() {
		// sets default values for checkboxes
		setSelectedFriends(
			filteredFriends.reduce(
				(acc, item) => ({
					...acc,
					[item.friend._id]: false,
				}),
				{}
			)
		);
	}

	const addToGroup = async () => {
		// process of adding selected users to the group
		if (groupId) {
			const { errors } = await GroupController.addParticipantsToGroup(groupId, selectedUser);
			if (!errors) {
				altogic.realtime.send(groupId, 'added-participants', selectedUser);
				selectedUser.forEach(member => altogic.realtime.send(member._id, 'reload-groups', groupId));
				closeModal();
			}
		}
	};

	const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
		setSelectedFriends(prev => ({ ...prev, [e.target.value]: e.target.checked }));
	};

	return (
		<Modal isOpen={isOpen} closeModal={closeModal} title="Add participant">
			<section className="relative rounded-bl-[3px] rounded-br-[3px] bg-background-default-light pb-4 dark:bg-background-default-dark">
				{filteredFriends?.length > 0 ? (
					<div className="dark:text-teal-dark p-[30px_0_15px_25px] text-base text-teal-light">CONTACTS</div>
				) : (
					<div className="dark:text-teal-dark p-[30px_0_15px_25px] text-center text-lg text-teal-light">
						There are no contacts to add group
					</div>
				)}
				{filteredFriends.map(item => (
					<Checkbox
						onChange={onChangeHandler}
						className="grid grid-cols-[auto_1fr] px-[13px]"
						value={item.friend._id}
						name={item.friend._id}
						key={item._id}
					>
						<AddParticipantToGroup.Item user={item.friend} />
					</Checkbox>
				))}
				{selectedUser.length > 0 && (
					<Button
						onClick={addToGroup}
						className="absolute bottom-8 right-8 !h-[60px] !w-[60px] !bg-button-round-background-light dark:!bg-button-round-background-dark"
						withIcon
					>
						<CheckIcon className="h-8 w-8" />
					</Button>
				)}
			</section>
		</Modal>
	);
}

interface AddParticipantToGroupItemProps {
	user: User;
}
AddParticipantToGroup.Item = ({ user }: AddParticipantToGroupItemProps) => {
	return (
		<section className="relative grid h-[72px] max-h-[72px] w-full cursor-pointer grid-cols-[77px_1fr] grid-rows-1 transition hover:bg-background-default-hover-light dark:hover:bg-background-default-hover-dark">
			<div className="relative flex w-[77px] shrink-0 items-center justify-center px-[13px]">
				<UserAvatar className="[&:first-child]:w-[49px]" image={user.profilePicture} name={user.name} />
			</div>
			<div
				className={`flex flex-col justify-center border-t border-b border-background-default-hover-light dark:border-background-default-hover-dark`}
			>
				<div className="text-base font-medium">{user.name}</div>
			</div>
		</section>
	);
};
