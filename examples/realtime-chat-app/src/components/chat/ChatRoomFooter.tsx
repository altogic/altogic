import Button from '../core/Button';
import { useEffect, useRef, useState, FormEvent, ChangeEvent } from 'react';
import useMediaQuery from '../../hooks/useMediaQuery';
import { sendMessage, sendTyping } from '../../helpers/socket';
import { useAuthStore, useSendingMessageStore } from '../../store';
import { MessageController } from '../../controllers';
import { ImageIcon, SendIcon } from '../icon';
import { MessageService } from '../../services';
import { EmojiPicker, ImagePreview } from '../index';

export default function ChatRoomFooter({ groupId }: RoomFooterProps) {
	const { user } = useAuthStore();
	const {
		imagePreviewIsOpen,
		setImagePreviewIsOpen,
		setSelectedFile,
		selectedFile,
		setLoadingFile,
		setUploadedFileURL,
		setTemporaryFileURL,
		uploadedFileURL,
		loadingFile,
	} = useSendingMessageStore();
	const fileInput = useRef<HTMLInputElement>(null);
	const messageInput = useRef<HTMLInputElement>(null);
	const matched = useMediaQuery('(min-width: 420px)');
	const [emojiOpen, setEmojiOpen] = useState(false);
	const timeout = useRef<number>();

	useEffect(() => {
		document.addEventListener('paste', onPaste);
		return () => {
			document.removeEventListener('paste', onPaste);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!imagePreviewIsOpen && messageInput.current) messageInput.current.focus();
	}, [imagePreviewIsOpen]);

	useEffect(() => {
		if (!messageInput.current) return;
		messageInput.current.value = '';
		messageInput.current.focus();
	}, [groupId]);

	const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
		clearTimeout(timeout.current);
		if (groupId && user) {
			sendTyping(groupId, user, true);
			timeout.current = window.setTimeout(() => sendTyping(groupId, user, false), 3000);
		}
	};

	const onPaste = async (e: any) => {
		if (e.clipboardData.files.length > 0) {
			await uploadFile(e.clipboardData.files[0]);
		}
	};

	const onSubmitHandler = async (e: FormEvent) => {
		e.preventDefault();
		if (!messageInput.current) return;
		const msg = messageInput.current.value.trim();
		if (loadingFile || !groupId || !user || (!msg && !selectedFile)) return;
		const data = {
			_id: crypto.randomUUID(),
			content: msg,
			sender: {
				_id: user?._id ?? '',
				name: user?.name ?? '',
			},
			...(uploadedFileURL && selectedFile && { media: { type: selectedFile.type, url: uploadedFileURL } }),
			group: groupId,
			isRead: false,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};
		sendMessage(groupId, data);
		setImagePreviewIsOpen(false);
		messageInput.current.value = '';
		setSelectedFile(null);
		setTemporaryFileURL(null);
		setUploadedFileURL(null);
		setLoadingFile(false);
		await MessageController.createMessage(data);
	};

	const onEmojiSelect = (emoji: any, input = messageInput.current) => {
		console.log(emoji.native);
		const curPos = input?.selectionStart;
		if (!input) return;
		let inputValue = input.value;
		if (curPos) {
			input.value = inputValue.slice(0, curPos) + emoji.native + inputValue.slice(curPos);
			input.setSelectionRange(curPos + emoji.native.length, curPos + emoji.native.length);
		} else {
			input.value += emoji.native;
		}
		input.focus();
		setEmojiOpen(false);
	};

	const uploadFile = async (file: File) => {
		setSelectedFile(file);
		setTemporaryFileURL(URL.createObjectURL(file));
		setImagePreviewIsOpen(true);
		setLoadingFile(true);
		const { errors, mediaURL } = await MessageService.uploadMedia(file);
		setLoadingFile(false);
		if (!errors) {
			setTemporaryFileURL(null);
			setUploadedFileURL(mediaURL);
		}
	};

	const onFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (fileInput.current) fileInput.current.value = '';
		if (!file) return;
		await uploadFile(file);
	};

	return (
		<form onSubmit={onSubmitHandler}>
			<footer className="flex min-h-[62px] items-center border-l border-l-border-stronger-light dark:border-l-border-stronger-dark">
				<div className="flex h-full w-full items-center gap-2 p-[5px_17px_5px_10px]">
					<div className="relative flex items-center gap-1">
						{matched && (
							<EmojiPicker
								onEmojiSelect={onEmojiSelect}
								emojiOpen={emojiOpen}
								setEmojiOpen={setEmojiOpen}
							/>
						)}

						<Button type="button" withIcon className="relative text-icon-light dark:text-icon-dark">
							<label className="absolute inset-0 grid place-items-center">
								<ImageIcon />
								<input
									onChange={onFileSelect}
									ref={fileInput}
									name="picture"
									accept="image/*"
									className="hidden"
									type="file"
								/>
							</label>
						</Button>
					</div>
					<input
						onChange={onChangeHandler}
						ref={messageInput}
						type="text"
						className="flex-1 rounded-lg bg-compose-input-background-light p-[9px_12px_11px] text-[15px] text-primary-light placeholder:text-input-placeholder-light focus:outline-none dark:bg-compose-input-background-dark dark:text-primary-dark dark:placeholder:text-input-placeholder-dark"
						placeholder="Type a message"
					/>
					<div className="flex items-center">
						<Button type="submit" withIcon className="text-icon-light dark:text-icon-dark">
							<SendIcon />
						</Button>
					</div>
				</div>
			</footer>
			<ImagePreview onEmojiSelect={onEmojiSelect} inputRef={messageInput} />
		</form>
	);
}
interface RoomFooterProps {
	groupId?: string;
}
