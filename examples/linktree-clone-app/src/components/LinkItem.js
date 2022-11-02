import { useAuthStore, useLinkStore } from '../store';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import altogic from '../lib/altogic';
import LoadingIcon from './LoadingIcon';
import { FiEdit2, FiTrash } from 'react-icons/fi';

export default function LinkItem({ data }) {
	const { setEditModalIsOpen, setSelectedLink, removeLink } = useLinkStore();
	const [deleteLoading, setDeleteLoading] = useState(false);
	const { user } = useAuthStore();
	const { username } = useParams();
	const isMe = user ? user.username === username : false;

	const editHandler = () => {
		if (!isMe) return;
		setSelectedLink(data);
		setEditModalIsOpen(true);
	};
	const deleteHandler = async () => {
		if (!isMe) return;
		setDeleteLoading(true);
		await altogic.db.model('links').object(data._id).delete();
		removeLink(data._id);
		setDeleteLoading(false);
	};

	return (
		<>
			<article
				className={`grid bg-[#222222] min-h-[3.5rem] rounded-[14px] text-center hover:scale-[1.02] px-2 transition ${
					isMe ? 'grid-cols-[40px_40px_1fr_40px_40px]' : 'grid-cols-[40px_1fr_40px]'
				}`}
			>
				<span className="flex items-center justify-center h-full">
					<img className="w-6 h-6 lg:w-8 lg:h-8" src={data.icon.url} alt="" />
				</span>
				{isMe && <span />}
				<a
					rel="noreferrer"
					target="_blank"
					className="flex-1 h-full flex items-center justify-center text-sm md:text-base"
					href={data.url}
				>
					{data.title}
				</a>
				{isMe && (
					<>
						<button
							onClick={deleteHandler}
							className="h-full grid place-items-center !outline-none"
							hidden={!isMe}
						>
							{deleteLoading ? (
								<LoadingIcon className="w-4 h-4 md:h-5 md:w-5" />
							) : (
								<FiTrash className="!outline-none w-4 h-4 md:h-5 md:w-5" />
							)}
						</button>
						<button
							onClick={editHandler}
							className="h-full grid place-items-center !outline-none"
							hidden={!isMe}
						>
							<FiEdit2 className="!outline-none w-4 h-4 md:h-5 md:w-5" />
						</button>
					</>
				)}
			</article>
		</>
	);
}
