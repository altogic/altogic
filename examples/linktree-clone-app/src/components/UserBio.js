import { MdCheck, MdEdit } from 'react-icons/md';
import { useRef, useState } from 'react';
import altogic from '../lib/altogic';
import { useAuthStore } from '../store';
import LoadingIcon from './LoadingIcon';
import { useParams } from 'react-router-dom';

export default function UserBio({ bio }) {
	const bioRef = useRef();
	const { user, updateUserProperty } = useAuthStore();
	const [changing, setChanging] = useState(false);
	const [editBio, setEditBio] = useState(false);
	const [newBio, setNewBio] = useState(bio ?? '');
	const { username } = useParams();
	const isMe = user ? user.username === username : false;

	const openEditMode = () => {
		setEditBio(true);
		setTimeout(() => {
			bioRef.current?.focus();
		}, 100);
	};

	const saveNewBio = async () => {
		if (newBio === bio || newBio.trim().length === 0) {
			return setEditBio(false);
		}
		setChanging(true);
		const { errors } = await altogic.db.model('users').object(user._id).update({ bio: newBio });
		if (!errors) {
			updateUserProperty('bio', newBio);
			setNewBio(newBio);
			setEditBio(false);
		}
		setChanging(false);
	};

	return (
		<div className="flex items-center justify-center text-zinc-400 text-[14px] font-normal w-full">
			<div className="flex items-center justify-center gap-1 w-full">
				{!!bio || editBio ? (
					<>
						<input
							className={`px-1 border border-white/10 rounded bg-transparent text-center outline-none resize-none w-full ${
								editBio ? 'block' : 'hidden'
							}`}
							value={newBio}
							ref={bioRef}
							type="text"
							onChange={e => setNewBio(e.target.value)}
						/>
						<h2
							style={{ overflowWrap: 'break-word' }}
							className={`px-2 max-w-[80vw] md:max-w-[70ch] whitespace-pre-wrap ${
								editBio ? 'hidden' : 'block'
							}`}
						>
							{bio}
						</h2>
					</>
				) : (
					isMe && <p>Click pen icon to add bio</p>
				)}

				{isMe ? (
					editBio ? (
						<button onClick={saveNewBio} className="w-6 h-6 grid place-items-center">
							{changing ? <LoadingIcon className="w-4 h-4" /> : <MdCheck size={21} />}
						</button>
					) : (
						<button onClick={openEditMode} className="w-6 h-6 grid place-items-center">
							<MdEdit size={17} />
						</button>
					)
				) : null}
			</div>
		</div>
	);
}
