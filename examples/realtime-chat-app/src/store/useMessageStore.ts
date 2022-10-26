import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { _Message } from '../types';
import { useAuthStore, useGroupStore, useUnreadMessageCountStore } from './index';
import { MessageService } from '../services';
import { MessageController } from '../controllers';

interface MessageStore {
	messages: _Message[];
	addMessage: (message: _Message) => void;
	markMessageAsRead: (messageId: string) => void;
	markAllMessagesAsRead: (groupId: string) => void;
	setRead: (messageId: string) => void;
	fetchMessages: (groupId: string) => Promise<void>;
	deleteMessage: (messageId: string) => void;
}

const useMessageStore = create<MessageStore>()(
	devtools(
		(set, getState) => ({
			messages: [],
			addMessage: message => {
				set(state => ({ messages: [message, ...state.messages] }));
				useGroupStore.getState().updateGroupLastMessageDate(message.group, message.createdAt);
			},
			setRead: messageId => {
				set(state => ({
					messages: state.messages.map(message => {
						if (message._id === messageId) {
							message.isRead = true;
						}
						return message;
					}),
				}));
			},
			markMessageAsRead: async messageId => {
				const userId = useAuthStore.getState().user?._id;
				if (!userId) throw new Error('User not found');
				set(state => {
					return {
						messages: state.messages.map(message => {
							if (message._id === messageId && message.sender._id !== userId) {
								message.isRead = true;
							}
							return message;
						}),
					};
				});

				const { errors } = await MessageService.update(messageId, { isRead: true });
				if (errors) throw new Error("Couldn't mark message as read");
			},
			markAllMessagesAsRead: async groupId => {
				const userId = useAuthStore.getState().user?._id;
				if (!userId) throw new Error('User not found');
				useUnreadMessageCountStore.getState().markAsRead(groupId);
				set(state => ({
					messages: state.messages.map(message => {
						if (message.group === groupId && message.sender._id !== userId) {
							message.isRead = true;
						}
						return message;
					}),
				}));
				const { errors } = await MessageService.markAllMessagesAsRead(groupId);
				if (errors) throw new Error("Couldn't mark messages as read");
			},
			fetchMessages: async (groupId: string) => {
				await MessageController.getMessagesByUserId(groupId);
			},
			deleteMessage: messageId => {
				set(state => ({
					messages: state.messages.filter(message => message._id !== messageId),
				}));
			},
		}),
		{
			name: 'message-storage',
		}
	)
);

export default useMessageStore;
