import { useLinkStore } from '../store';
import { AiOutlinePlus } from 'react-icons/ai';

export default function AddLinkButton({ className }) {
	const { setAddModalIsOpen } = useLinkStore();
	return (
		<button
			className={`bg-[#f0f0f0] text-black rounded-full w-[40px] h-[40px] grid place-items-center ${
				className ?? ''
			}`}
			onClick={() => setAddModalIsOpen(true)}
		>
			<AiOutlinePlus size={20} />
		</button>
	);
}
