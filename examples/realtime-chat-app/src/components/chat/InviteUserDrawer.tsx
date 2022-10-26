import { Button, Drawer, Input, Loading } from '../index';
import { FormEvent, useState, ChangeEvent } from 'react';
import { FriendController } from '../../controllers';
import { dispatchESCPress } from '../../helpers';

interface InviteUserDrawerProps {
	isOpen: boolean;
	close: () => void;
}
export default function InviteUserDrawer({ close, isOpen }: InviteUserDrawerProps) {
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');
	const [errorMessage, setErrorMessage] = useState('');

	const submitHandler = async (e: FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMessage('');
		setErrorMessage('');
		const { errors } = await FriendController.sendFriendRequest(email);
		if (errors && errors.items[0].message.includes('already')) {
			setErrorMessage(errors.items[0].message);
			setTimeout(() => {
				setErrorMessage('');
			}, 5000);
		} else {
			setMessage('Your invitation has been sent!');
			setTimeout(() => {
				setMessage('');
				dispatchESCPress();
			}, 2000);
		}
		setEmail('');
		setLoading(false);
	};
	const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (value.length === 1 && value.trim().length === 0) return;
		setEmail(value);
	};
	return (
		<Drawer from="left" isOpen={isOpen} close={close} title="Invite user">
			<form onSubmit={submitHandler} className="bg-background-default-light dark:bg-background-default-dark">
				<div className="my-4 p-2 text-center font-medium text-primary-strong-light dark:text-primary-strong-dark md:text-2xl">
					You can invite your friend to chat
				</div>
				<div className="w-full p-2">
					{errorMessage && <p className="text-center text-red-700 dark:text-red-400">{errorMessage}</p>}

					<div className="relative flex h-[50px] items-center rounded-lg bg-search-input-background-light dark:bg-search-input-background-dark">
						<Input
							value={email}
							onChange={onChangeHandler}
							type="email"
							className="h-[35px] border-none bg-transparent text-[17px] text-primary-light dark:text-primary-dark"
							placeholder="Type a user email"
							required
						/>
					</div>
					<p className="mt-2 px-2 text-center text-sm text-secondary-light dark:text-secondary-dark">
						We'll send a notification if your friend you invited is already a member, otherwise we'll send
						an invitation email
					</p>
					<Button
						disabled={loading || !!message}
						className={`relative mt-6 h-[40px] w-full ${
							message
								? '!dark:text-drawer-header-title-dark border-panel-background-colored-light bg-panel-background-colored-light !text-drawer-header-title-light dark:border-panel-background-colored-dark dark:bg-panel-background-colored-dark'
								: '!dark:text-primary-strong-dark'
						}`}
					>
						{loading ? (
							<Loading className="absolute inset-0 m-auto h-8 w-8 text-icon-light dark:text-icon-dark" />
						) : message ? (
							message
						) : (
							'Invite'
						)}
					</Button>
				</div>
			</form>
		</Drawer>
	);
}
