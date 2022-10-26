import { useAuthStore } from '../../store';
import { Button, Drawer, Input, Loading, LogoutButton } from '../index';
import { useEffect, useId, useState, KeyboardEvent as ReactKeyboardEvent, useRef } from 'react';
import { updateUserName, setUserProfilePicture } from '../../helpers/auth';
import { CameraIcon, CheckIcon, PenIcon } from '../icon';
import { setProfile } from '../../helpers/socket';

interface ProfileSettingsDrawerProps {
	isOpen: boolean;
	close: () => void;
}
export default function ProfileSettingsDrawer({ isOpen, close }: ProfileSettingsDrawerProps) {
	return (
		<Drawer from="left" isOpen={isOpen} close={close} title="Profile">
			<div className="flex flex-1 flex-col items-center gap-6 p-4">
				<ProfilePictureUpdate />
				<NameUpdate />
				<LogoutButton className="mt-auto w-full text-text-muted-light dark:text-text-muted-dark" />
			</div>
		</Drawer>
	);
}

function ProfilePictureUpdate() {
	const pictureId = useId();
	const { user, setUser } = useAuthStore();
	const [updateProfilePictureLoading, setUpdateProfilePictureLoading] = useState(false);

	const onFilePickerChange = async (e: any) => {
		setUpdateProfilePictureLoading(true);
		const [file] = e.target.files;
		const { data, errors } = await setUserProfilePicture(file);
		if (!errors) {
			setUser(data);
			setProfile(data);
		}
		setUpdateProfilePictureLoading(false);
	};

	return (
		<>
			<input onChange={onFilePickerChange} hidden type="file" name="picture" accept="image/*" id={pictureId} />
			<label htmlFor={pictureId} className="group relative w-fit cursor-pointer">
				<img
					draggable={false}
					className="aspect-square aspect-square h-[200px] w-[200px] rounded-full object-cover"
					src={
						user?.profilePicture ||
						`https://ui-avatars.com/api/?name=${user?.name}&background=0D8ABC&color=fff`
					}
					alt={user?.name}
				/>
				<span className="absolute inset-0 m-auto flex h-[200px] w-[200px] flex-col items-center justify-center gap-2 rounded-full font-medium text-inverse-light opacity-0 transition group-hover:bg-photopicker-overlay-background-light group-hover:opacity-100 dark:text-inverse-dark dark:group-hover:bg-photopicker-overlay-background-dark">
					<CameraIcon />
					<p className="text-center text-[13px]">
						CHANGE YOUR <br />
						PROFILE PICTURE
					</p>
				</span>
				{updateProfilePictureLoading && (
					<div className="absolute inset-0 m-auto flex items-center justify-center rounded-full bg-white/50">
						<Loading />
					</div>
				)}
			</label>
		</>
	);
}
function NameUpdate() {
	const { user, setUser } = useAuthStore();
	const [isEditable, setIsEditable] = useState(false);
	const [userName, setUserName] = useState<string>('');
	const editNameInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (isEditable && editNameInputRef.current) {
			editNameInputRef.current.focus();
		}
	}, [isEditable]);
	const editHandler = () => {
		if (user?.name) setUserName(user.name);
		setIsEditable(true);
	};
	const saveName = async () => {
		setIsEditable(false);
		if (userName === user?.name || !userName) return;
		const { data, errors } = await updateUserName(userName);
		if (!errors) {
			setUser(data);
			setProfile(data);
		}
	};
	const onSubmitHandler = (e: ReactKeyboardEvent<HTMLInputElement>) => {
		if (e.code !== 'Enter') return;
		saveName();
	};
	return (
		<div className="flex w-full flex-col items-center justify-center gap-10">
			<div className="flex w-full flex-col gap-4">
				<span className="dark:text-teal-dark text-teal-light">Your name</span>
				<div className="flex items-center justify-between text-[17px] text-primary-light dark:text-primary-dark">
					{isEditable ? (
						<>
							<Input
								className="h-[40px] border-none bg-transparent !p-0 text-[17px] text-primary-light dark:text-primary-dark"
								onChange={e => setUserName(e.target.value)}
								value={userName}
								onBlur={saveName}
								onKeyDown={onSubmitHandler}
								ref={editNameInputRef}
							/>
							<Button
								onClick={saveName}
								withIcon
								className="text-icon-fixed-light dark:text-icon-fixed-dark"
							>
								<CheckIcon />
							</Button>
						</>
					) : (
						<>
							<span>{user?.name}</span>
							<Button
								onClick={editHandler}
								withIcon
								className="text-icon-fixed-light dark:text-icon-fixed-dark"
							>
								<PenIcon />
							</Button>
						</>
					)}
				</div>
				<span className="text-[14px] text-text-muted-light dark:text-text-muted-dark">
					This is not your username or pin. This name will be visible to your WhatsApp contacts.
				</span>
			</div>
		</div>
	);
}
