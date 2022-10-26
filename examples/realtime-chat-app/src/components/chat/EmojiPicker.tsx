import useMediaQuery from '../../hooks/useMediaQuery';
import Button from '../core/Button';
import { EmojiIcon } from '../icon';
import { Dispatch, SetStateAction } from 'react';
import data from '@emoji-mart/data';
// @ts-ignore
import Picker from '@emoji-mart/react';

interface EmojiProps {
	onEmojiSelect: (emoji: any) => void;
	setEmojiOpen: Dispatch<SetStateAction<boolean>>;
	emojiOpen: boolean;
	className?: string;
}

export default function EmojiPicker({ onEmojiSelect, setEmojiOpen, emojiOpen, className }: EmojiProps) {
	const isDarkPreference = useMediaQuery('(prefers-color-scheme: dark)');
	return (
		<div className="relative">
			<Button
				onClick={() => setEmojiOpen(prev => !prev)}
				type="button"
				withIcon
				className="text-icon-light dark:text-icon-dark"
			>
				<EmojiIcon />
			</Button>
			{emojiOpen && (
				<div className={`absolute -top-4 left-0 -translate-y-full ${className ?? ''}`}>
					<Picker theme={isDarkPreference ? 'dark' : 'light'} data={data} onEmojiSelect={onEmojiSelect} />
				</div>
			)}
		</div>
	);
}
