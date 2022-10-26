import create from 'zustand';
import { devtools } from 'zustand/middleware';

interface SendingMessageStore {
	selectedFile: File | null;
	imagePreviewIsOpen: boolean;
	loadingFile: boolean;
	uploadedFileURL: string | null;
	temporaryFileURL: string | null;
	setSelectedFile: (file: File | null) => void;
	setLoadingFile: (loading: boolean) => void;
	setImagePreviewIsOpen: (isOpen: boolean) => void;
	setUploadedFileURL: (url: string | null) => void;
	setTemporaryFileURL: (url: string | null) => void;
}
const useSendingMessageStore = create<SendingMessageStore>()(
	devtools(
		set => ({
			selectedFile: null,
			loadingFile: false,
			imagePreviewIsOpen: false,
			uploadedFileURL: null,
			temporaryFileURL: null,

			setSelectedFile: (file: File | null) => {
				set({ selectedFile: file });
			},
			setLoadingFile: (loading: boolean) => {
				set({ loadingFile: loading });
			},
			setImagePreviewIsOpen: (isOpen: boolean) => {
				set({ imagePreviewIsOpen: isOpen });
			},
			setUploadedFileURL: (url: string | null) => {
				set({ uploadedFileURL: url });
			},
			setTemporaryFileURL: (url: string | null) => {
				set({ temporaryFileURL: url });
			},
		}),
		{
			name: 'sending-message-storage',
		}
	)
);

export default useSendingMessageStore;
