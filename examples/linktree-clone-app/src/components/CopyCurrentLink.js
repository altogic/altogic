import copy from 'copy-to-clipboard';
import { MdContentCopy, MdOutlineCheck } from 'react-icons/md';
import { useState } from 'react';

export default function CopyCurrentLink({ className }) {
	const [copied, setCopied] = useState(false);

	const onClickHandler = async () => {
		if (navigator.share) {
			await navigator.share({
				title: document.title,
				url: window.location.href,
			});
		} else {
			copy(window.location.href);
		}
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<button
			onClick={onClickHandler}
			className={`bg-[#f0f0f0] text-black rounded-full w-[40px] h-[40px] grid place-items-center ${
				className ?? ''
			}`}
		>
			{copied ? <MdOutlineCheck size={23} /> : <MdContentCopy size={20} />}
		</button>
	);
}
