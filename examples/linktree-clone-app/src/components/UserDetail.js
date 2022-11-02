import { useState } from 'react';
import { FiUploadCloud } from 'react-icons/fi';
import LoadingIcon from './LoadingIcon';
import altogic from '../lib/altogic';
import { useAuthStore } from '../store';
import { useParams } from 'react-router-dom';
import UserBio from './UserBio';

export default function UserDetail({ name, className, image, bio, ...props }) {
	const [loading, setLoading] = useState(false);
	const { user, updateUserProperty } = useAuthStore();

	const { username } = useParams();
	const isMe = user ? user.username === username : false;

	const onUploadHandler = async e => {
		if (!isMe) return;
		setLoading(true);
		const file = e.target.files[0];
		const { data, errors } = await altogic.storage.root.upload(file.name, file);
		if (!errors) {
			await altogic.db.model('users').object(user._id).update({ profilePicture: data.publicPath });
			updateUserProperty('profilePicture', data.publicPath);
		}
		setLoading(false);
	};

	return (
		<figure className={`flex flex-col gap-4 items-center justify-center ${className ?? ''}`} {...props}>
			<picture
				className={`rounded-full overflow-hidden w-24 h-24 cursor-pointer group relative ${
					!image ? 'bg-fuchsia-500 grid place-items-center' : ''
				}`}
			>
				{image ? (
					<img draggable={false} className="object-cover" src={image} alt="user profile pic" />
				) : (
					<span className="text-white text-7xl leading-none select-none">{name[0].toUpperCase()}</span>
				)}
				{isMe && (
					<label
						className={`absolute inset-0 grid place-items-center transition group-hover:bg-black/60 opacity-0 group-hover:opacity-100 z-10 cursor-pointer
					${loading ? 'bg-black/60 opacity-100' : ''}`}
					>
						<input onChange={onUploadHandler} type="file" className="hidden" />
						{loading ? <LoadingIcon className="w-16 h-16" /> : <FiUploadCloud size={35} />}
					</label>
				)}
			</picture>

			<figcaption className="text-center w-full flex flex-col">
				<h3 className="text-[20px] font-bold">@{name}</h3>
				<UserBio bio={bio} />
			</figcaption>
		</figure>
	);
}
