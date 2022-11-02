import Modal from './Modal';
import { useLinkStore } from '../store';
import { useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import altogic from '../lib/altogic';
import LoadingIcon from './LoadingIcon';
import { useLoaderData } from 'react-router-dom';

export default function EditLink() {
	const { linkIcons } = useLoaderData();
	const { selectedLink, updateLink, setEditModalIsOpen, editModalIsOpen } = useLinkStore();
	const [loading, setLoading] = useState(false);
	const [title, setTitle] = useState('');
	const [url, setUrl] = useState('');
	const [linkType, setLinkType] = useState({});
	const [selectedOption, setSelectedOption] = useState(null);

	const options = useMemo(() => {
		return linkIcons.map(linkType => ({ value: linkType._id, label: linkType.title }));
	}, [linkIcons]);

	const defaultSelect = useMemo(() => {
		const option = options.find(option => option.value === selectedLink?.icon?._id);
		setSelectedOption(option);
		return option;
	}, [options, selectedLink]);

	useEffect(() => {
		setTitle(selectedLink?.title ?? '');
		setUrl(selectedLink?.url ?? '');
		setLinkType(selectedLink?.icon ?? {});
	}, [selectedLink]);

	useEffect(() => {
		const linkType = linkIcons.find(linkType => linkType._id === selectedOption?.value);
		setLinkType(linkType);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedOption]);

	const titleChangeHandler = e => setTitle(e.target.value);
	const linkChangeHandler = e => setUrl(e.target.value);

	const save = async e => {
		e.preventDefault();
		setLoading(true);
		const newLink = { ...selectedLink, title, url, icon: linkType };
		const dataForDB = { ...newLink, belongsTo: newLink.belongsTo._id, icon: newLink.icon._id };

		const { errors } = await altogic.db.model('links').object(selectedLink._id).update(dataForDB);
		if (!errors) {
			updateLink(newLink);
			setEditModalIsOpen(false);
		}
		setLoading(false);
	};

	return (
		<Modal isOpen={editModalIsOpen} close={() => setEditModalIsOpen(false)} title="Edit Link">
			<form onSubmit={save} className="p-3 relative flex flex-col gap-2">
				<div>
					<label className="text-gray-600 text-[15px]" htmlFor="linkName">
						Description
					</label>
					<input
						id="linkName"
						onChange={titleChangeHandler}
						value={title}
						className="w-full outline-none text-lg border border-[#cccccc] px-2 py-1 rounded"
						type="text"
						placeholder="Title"
					/>
				</div>
				<div>
					<label className="text-gray-600 text-[15px]" htmlFor="linkType">
						Link Type
					</label>
					<Select
						id="linkType"
						placeholder="Select link type"
						defaultValue={defaultSelect}
						onChange={setSelectedOption}
						options={options}
					/>
				</div>
				<div>
					<label className="text-gray-600 text-[15px]" htmlFor="link">
						Link
					</label>
					<input
						id="link"
						type="url"
						onChange={linkChangeHandler}
						value={url}
						className="min-h-[38px] w-full outline-none resize-none text-lg border border-[#cccccc] px-2 py-1 rounded"
						placeholder="Url"
					/>
				</div>

				<div className="flex justify-end">
					<button type="submit" className="text-white bg-green-500 rounded-full px-6 py-2">
						{loading ? <LoadingIcon className="h-6" /> : 'Save'}
					</button>
				</div>
			</form>
		</Modal>
	);
}
