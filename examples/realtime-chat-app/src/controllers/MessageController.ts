import { GroupService, MessageService } from '../services';
import { useGroupStore, useMessageStore, useUnreadMessageCountStore } from '../store';
import { _Message } from '../types';
import altogic from '../libs/altogic';

class MessageController {
	/**
	 * Getting messages of current group
	 * @param groupId
	 */
	static async getMessagesByUserId(groupId: string) {
		const { messages, errors } = await MessageService.getMessagesByGroupId(groupId);
		if (errors) throw new Error("Couldn't get messages");

		useMessageStore.setState(state => {
			const ids = messages.map(message => message._id);
			const oldMessages = state.messages.filter(message => !ids.includes(message._id));
			return {
				messages: [...oldMessages, ...messages],
			};
		});
		return messages;
	}
	/**
	 * Creating a new message
	 */
	static async createMessage(data: _Message) {
		const { message, errors } = await MessageService.createMessage({
			content: data.content,
			sender: data?.sender?._id,
			...(data.media && { media: data.media }),
			isRead: data.isRead,
			group: data.group,
		});
		if (errors) throw new Error("Couldn't create message");

		const res = await MessageService.getMessageById(message._id);
		useMessageStore.setState(state => {
			return {
				messages: state.messages.map(item => {
					if (item._id === data._id) {
						// @ts-ignore
						item = res.message;
					}
					return item;
				}),
			};
		});
		useGroupStore.getState().updateGroupLastMessageDate(data.group, message.createdAt);
		await GroupService.update(data.group, { lastMessageDate: message.createdAt });
	}
	/**
	 * Calculating unread messages count
	 */
	static async calculateUnreadMessagesFromDB() {
		const { data, errors } = await MessageService.getUnreadMessages();
		if (errors) throw new Error("Couldn't get unread messages");

		const unreadMessageCount = Object.fromEntries(data.map(item => [item.groupby.group, item.unreadMessagesCount]));
		useUnreadMessageCountStore.setState({ unreadMessageCount });
	}
	/**
	 * Deleting a message
	 */
	static async deleteMessage(groupId: string, messageId: string) {
		const { errors } = await MessageService.deleteMessage(messageId);
		if (errors) throw new Error("Couldn't delete message");

		altogic.realtime.send(groupId, 'message-deleted', messageId);
	}
}

export default MessageController;
