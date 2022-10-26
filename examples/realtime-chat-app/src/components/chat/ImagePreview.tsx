import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Button from '../core/Button';
import { CloseIcon, SendIcon } from '../icon';
import { EmojiPicker, Loading } from '../index';
import { useSendingMessageStore } from '../../store';
import altogic from '../../libs/altogic';

interface ImagePreviewProps {
	onEmojiSelect: (emoji: any, input: any) => void;
	inputRef: any;
}
export default function ImagePreview({ onEmojiSelect, inputRef }: ImagePreviewProps) {
	const [emojiOpen, setEmojiOpen] = useState(false);
	const messageInputOnImagePreview = useRef<HTMLInputElement>(null);
	const {
		imagePreviewIsOpen,
		setImagePreviewIsOpen,
		setSelectedFile,
		setLoadingFile,
		setUploadedFileURL,
		setTemporaryFileURL,
		uploadedFileURL,
		temporaryFileURL,
		loadingFile,
	} = useSendingMessageStore();
	const image = uploadedFileURL ?? temporaryFileURL;

	useEffect(() => {
		if (imagePreviewIsOpen && messageInputOnImagePreview.current) messageInputOnImagePreview.current.focus();
	}, [imagePreviewIsOpen]);

	useEffect(() => {
		const keyDownHandler = (e: KeyboardEvent) => {
			if (e.code === 'Escape') close();
		};
		document.addEventListener('keydown', keyDownHandler);
		return () => {
			document.removeEventListener('keydown', keyDownHandler);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
		inputRef.current.value = e.target.value;
	};

	const onEmojiSelectHandler = (emoji: any) => {
		onEmojiSelect(emoji, messageInputOnImagePreview.current);
		setEmojiOpen(false);
	};

	const close = () => {
		if (uploadedFileURL) altogic.storage.deleteFile(uploadedFileURL);
		setImagePreviewIsOpen(false);
		setTemporaryFileURL(null);
		setUploadedFileURL(null);
		setSelectedFile(null);
		setLoadingFile(false);
	};

	return (
		<AnimatePresence>
			{imagePreviewIsOpen && (
				<motion.section
					initial={{
						scale: 0,
						opacity: 0,
					}}
					animate={{
						scale: 1,
						opacity: 1,
					}}
					exit={{
						scale: 0,
						opacity: 0,
					}}
					transition={{ type: 'tween' }}
					className="absolute inset-0 top-[59px] grid grid-rows-[72px_1fr_72px_99px] border-l border-inherit border-border-stronger-light bg-panel-background-deeper-light dark:border-border-stronger-dark dark:bg-panel-background-deeper-dark"
				>
					<div className="flex items-center p-2 text-media-editor-icon-color-light dark:text-media-editor-icon-color-dark">
						<Button withIcon className="!text-inherit" onClick={close}>
							<CloseIcon />
						</Button>
					</div>
					<div className="flex items-center justify-center p-4">
						{image && (
							// eslint-disable-next-line jsx-a11y/img-redundant-alt
							<img
								src={image}
								className="h-[500px] w-auto object-cover"
								alt="uploaded photo"
								draggable={false}
							/>
						)}
					</div>
					<div className="max-g flex items-center justify-center gap-2">
						<input
							onChange={onChangeHandler}
							ref={messageInputOnImagePreview}
							type="text"
							className="max-w-[75%] flex-1 rounded-lg bg-compose-input-background-light p-[9px_12px_11px] text-[15px] text-primary-light placeholder:text-input-placeholder-light focus:outline-none dark:bg-compose-input-background-dark dark:text-primary-dark dark:placeholder:text-input-placeholder-dark"
							placeholder="Type a message"
						/>
						<EmojiPicker
							className="!right-0 left-auto"
							onEmojiSelect={onEmojiSelectHandler}
							setEmojiOpen={setEmojiOpen}
							emojiOpen={emojiOpen}
						/>
					</div>
					<div className="p-4 pb-0">
						<div className="flex h-full items-center justify-end border-t border-border-stronger-light dark:border-border-stronger-dark">
							<Button
								className="!dark:bg-button-round-background-dark aspect-square !h-[60px] !w-[60px] !bg-button-round-background-light !text-white"
								withIcon
								disabled={loadingFile}
							>
								{loadingFile ? <Loading className="h-10 w-10" /> : <SendIcon />}
							</Button>
						</div>
					</div>
				</motion.section>
			)}
		</AnimatePresence>
	);
}
