import { Button, Drawer, Input, Loading } from '../index';
import { GroupParticipant } from '../../types';
import { useEffect, useState, ChangeEvent, useRef, KeyboardEvent as ReactKeyboardEvent } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '../../store';
import { CameraIcon, CheckIcon, PenIcon, PersonWithPlusIcon } from '../icon';
import { GroupController } from '../../controllers';
import AddParticipantToGroup from './AddParticipantToGroup';

export default function ChatDetailDrawer({ close, isOpen, chatDetail, isGroup }: ChatDetailDrawerProps) {
	const { user } = useAuthStore();
	const { groupId } = useParams();
	const [addParticipantsModalOpen, setAddParticipantsModalOpen] = useState(false);

	const member = chatDetail?.members.find(member => member._id !== user?._id);
	const name = isGroup ? chatDetail?.group.name : member?.name;
	const image = isGroup ? chatDetail?.group.profilePicture : member?.profilePicture;

	useEffect(() => {
		close();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [groupId]);

	return (
		<>
			<AddParticipantToGroup
				currentMembers={chatDetail?.members}
				isOpen={addParticipantsModalOpen}
				closeModal={() => setAddParticipantsModalOpen(false)}
			/>
			<Drawer
				from="right"
				isOpen={isOpen}
				close={close}
				title={isGroup ? 'Group info' : 'Contact info'}
				className="w-[400px] border-l border-conversation-panel-border-light dark:border-conversation-panel-border-dark"
			>
				<div className="flex flex-col gap-[10px] bg-drawer-background-deep-light pr-2 dark:bg-drawer-background-deep-dark">
					<div
						className={`flex flex-col items-center gap-4 bg-drawer-section-background-light p-[30px] shadow dark:bg-drawer-section-background-dark ${
							!isGroup ? 'flex-1' : ''
						}`}
					>
						{isGroup ? (
							<UpdateGroupInfo
								name={name}
								groupId={groupId}
								image={image ?? `https://ui-avatars.com/api/?name=${name}&background=0D8ABC&color=fff`}
							/>
						) : (
							<>
								<img
									draggable={false}
									className="h-[200px] w-[200px] rounded-full object-cover"
									src={
										image ?? `https://ui-avatars.com/api/?name=${name}&background=0D8ABC&color=fff`
									}
									alt={name}
								/>
								<p className="text-2xl text-primary-light dark:text-primary-dark">{name}</p>
							</>
						)}
					</div>
					{isGroup && (
						<div className="flex flex-1 flex-col bg-drawer-section-background-light shadow dark:bg-drawer-section-background-dark">
							<div className="p-[30px_30px_10px_30px] text-left text-text-secondary-lighter-light dark:text-text-secondary-lighter-dark">
								<p>{chatDetail?.members.length} participants</p>
							</div>
							<button
								onClick={() => setAddParticipantsModalOpen(true)}
								className="grid h-[69px] cursor-pointer grid-cols-[69px_1fr] items-center px-[17px] transition hover:bg-background-default-hover-light dark:hover:bg-background-default-hover-dark"
							>
								<div className="grid h-full place-items-center">
									<div className="grid h-[40px] h-full w-[40px] place-items-center rounded-full bg-round-icon-background-light text-white dark:bg-round-icon-background-dark">
										<PersonWithPlusIcon />
									</div>
								</div>
								<div className="flex h-full items-center">
									<p className="text-base text-primary-strong-light dark:text-primary-strong-dark">
										Add participant
									</p>
								</div>
							</button>
							<div>
								{chatDetail?.members.map(member => (
									<div
										key={member._id}
										className="grid h-[69px] grid-cols-[69px_1fr] items-center px-[17px] transition hover:bg-background-default-hover-light dark:hover:bg-background-default-hover-dark"
									>
										<div className="grid h-full place-items-center">
											<img
												draggable={false}
												src={
													member.profilePicture ??
													`https://ui-avatars.com/api/?name=${member.name}&background=0D8ABC&color=fff`
												}
												alt={member.name}
												className="aspect-square h-[40px] w-[40px] rounded-full object-cover"
											/>
										</div>
										<div className="flex h-full items-center">
											<p className="text-base text-primary-strong-light dark:text-primary-strong-dark">
												{member.name}
											</p>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</Drawer>
		</>
	);
}

function UpdateGroupInfo({ name, image, groupId }: UpdateGroupPictureProps) {
	const [loadingImage, setLoadingImage] = useState(false);
	const [loadingName, setLoadingName] = useState(false);
	const [error, setError] = useState('');
	const [groupName, setGroupName] = useState(name ?? '');
	const [updateMode, setUpdateMode] = useState(false);
	const changeGroupNameInputRef = useRef<HTMLInputElement>(null);

	const switchToEditMode = () => {
		setGroupName(name ?? '');
		setUpdateMode(true);
	};

	useEffect(() => {
		if (updateMode && changeGroupNameInputRef.current) changeGroupNameInputRef.current.focus();
	}, [updateMode]);

	const onFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file || !groupId) return;
		setLoadingImage(true);
		setError('');
		try {
			await GroupController.updateGroupPicture(groupId, file);
		} catch (e: any) {
			setError(e.message);
		} finally {
			setLoadingImage(false);
		}
	};
	const saveName = async () => {
		if (!groupId) return;
		setLoadingName(true);
		setError('');
		const newName = groupName.trim();
		if (newName === name) {
			setUpdateMode(false);
			setLoadingName(false);
			return;
		}
		try {
			await GroupController.updateGroupName(groupId, newName);
			setUpdateMode(false);
		} catch (e: any) {
			setError(e.message);
		} finally {
			setLoadingName(false);
		}
	};
	const onSubmitHandler = (e: ReactKeyboardEvent<HTMLInputElement>) => {
		if (e.code !== 'Enter') return;
		saveName();
	};

	return (
		<>
			{error && <p className="text-center text-sm text-red-500">{error}</p>}
			<label className="group relative cursor-pointer overflow-hidden rounded-full">
				{name && (
					<img
						draggable={false}
						className="h-[200px] w-[200px] rounded-full object-cover"
						src={image ?? `https://ui-avatars.com/api/?name=${name}&background=0D8ABC&color=fff`}
						alt={name}
					/>
				)}
				<span className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-full font-medium text-inverse-light opacity-0 transition group-hover:bg-photopicker-overlay-background-light group-hover:opacity-100 dark:text-inverse-dark dark:group-hover:bg-photopicker-overlay-background-dark">
					<CameraIcon />
					<p className="text-center text-[13px]">
						CHANGE YOUR <br />
						GROUP PICTURE
					</p>
				</span>
				{loadingImage && (
					<div className="absolute inset-0 m-auto flex items-center justify-center rounded-full bg-white/50">
						<Loading />
					</div>
				)}
				<input accept="image/*" onChange={onFileSelect} name="picture" type="file" className="hidden" />
			</label>
			{name && (
				<div className="relative flex items-center gap-4">
					{updateMode ? (
						<>
							<Input
								className="h-[32px] border-none bg-transparent !p-0 text-center text-2xl text-primary-light dark:text-primary-dark"
								onChange={e => setGroupName(e.target.value)}
								ref={changeGroupNameInputRef}
								onBlur={saveName}
								onKeyDown={onSubmitHandler}
								value={groupName}
							/>
							<Button
								onClick={saveName}
								withIcon
								className="absolute -right-2 translate-x-full text-icon-fixed-light dark:text-icon-fixed-dark"
							>
								{loadingName ? <Loading className="h-6 w-6" /> : <CheckIcon />}
							</Button>
						</>
					) : (
						<>
							<p className="text-2xl text-primary-light dark:text-primary-dark">{name}</p>
							<Button
								onClick={switchToEditMode}
								withIcon
								className="absolute -right-2 translate-x-full text-icon-fixed-light dark:text-icon-fixed-dark"
							>
								<PenIcon />
							</Button>
						</>
					)}
				</div>
			)}
		</>
	);
}

interface ChatDetailDrawerProps {
	isOpen: boolean;
	close: () => void;
	chatDetail?: GroupParticipant;
	isGroup: boolean;
}
interface UpdateGroupPictureProps {
	name?: string;
	image?: string;
	groupId?: string;
}
