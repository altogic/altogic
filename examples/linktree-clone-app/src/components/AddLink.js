import Modal from './Modal';
import { useAuthStore, useLinkStore } from '../store';
import { useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import altogic from '../lib/altogic';
import LoadingIcon from './LoadingIcon';
import { useLoaderData } from 'react-router-dom';

export default function AddLink() {
	const { linkIcons } = useLoaderData();
	const { user } = useAuthStore();
	const { addModalIsOpen, setAddModalIsOpen, addLink } = useLinkStore();
	const [loading, setLoading] = useState(false);
	const [title, setTitle] = useState('');
	const [url, setUrl] = useState('');
	const [linkType, setLinkType] = useState('');
	const [selectedOption, setSelectedOption] = useState(null);

	const options = useMemo(() => {
		return linkIcons.map(linkType => ({ value: linkType._id, label: linkType.title }));
	}, [linkIcons]);

	useEffect(() => {}, []);

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
		const icon = linkType ?? linkIcons.find(linkType => linkType.title === 'Other');
		const dataForDB = { title, url, icon: icon?._id, belongsTo: user._id };
		const { errors, data } = await altogic.db.model('links').create(dataForDB);
		setTitle('');
		setUrl('');
		setLinkType('');

		if (!errors) {
			data.icon = icon;
			data.belongsTo = user;
			addLink(data);
			setAddModalIsOpen(false);
		}
		setLoading(false);
	};

	return (
		<Modal isOpen={addModalIsOpen} close={() => setAddModalIsOpen(false)} title="Add Link">
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
						required
					/>
				</div>
				<div>
					<label className="text-gray-600 text-[15px]" htmlFor="linkType">
						Link Type
					</label>
					<Select
						id="linkType"
						placeholder="Select link type"
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
						onChange={linkChangeHandler}
						value={url}
						required
						type="url"
						className="min-h-[38px] w-full outline-none resize-none text-lg border border-[#cccccc] px-2 py-1 rounded"
						placeholder="Url"
					/>
				</div>

				<div className="flex justify-end">
					<button disabled={loading} type="submit" className="text-white bg-green-500 rounded-full px-6 py-2">
						{loading ? <LoadingIcon className="h-6" /> : 'Create'}
					</button>
				</div>
			</form>
		</Modal>
	);
}
