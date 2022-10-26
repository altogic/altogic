import altogic from '../libs/altogic';
import { _Message, Message } from '../types';
import { useAuthStore } from '../store';

class MessageService {
	static async getMessagesByGroupId(groupId: string) {
		const response = await altogic.db
			.model('messages')
			.filter(`group == '${groupId}'`)
			.lookup({ field: 'sender' })
			.sort('createdAt', 'desc')
			.limit(200)
			.get();
		return {
			messages: response.data as _Message[],
			errors: response.errors,
		};
	}
	static async getMessageById(messageId: string) {
		const response = await altogic.db
			.model('messages')
			.filter(`_id == '${messageId}'`)
			.lookup({ field: 'sender' })
			.limit(200)
			.get();
		return {
			// @ts-ignore
			message: response.data[0] as Message,
			errors: response.errors,
		};
	}
	static async createMessage(data: Partial<Message>) {
		const { data: message, errors } = await altogic.db.model('messages').create(data);
		return {
			message: message as Message,
			errors,
		};
	}
	static async uploadMedia(file: File) {
		// @ts-ignore
		const { data, errors } = await altogic.storage.bucket('chats').upload(file.name, file);
		return {
			// @ts-ignore
			mediaURL: data.publicPath as string,
			errors,
		};
	}
	static async update(messageId: string, data: Partial<Message>) {
		const { data: message, errors } = await altogic.db.model('messages').object(messageId).update(data);
		return {
			message: message as Message,
			errors,
		};
	}
	static async markAllMessagesAsRead(groupId: string) {
		const userId = useAuthStore.getState().user?._id;
		if (!userId) throw new Error('User not found');
		return altogic.db
			.model('messages')
			.filter(`group == '${groupId}' && isRead == false && sender != '${userId}'`)
			.update({ isRead: true });
	}
	static async getUnreadMessages() {
		const userId = useAuthStore.getState().user?._id;
		if (!userId) throw new Error('User not found');
		const data = await altogic.db
			.model('messages')
			.filter(`isRead == false && sender != '${userId}'`)
			.group('group')
			.compute({
				type: 'count',
				name: 'unreadMessagesCount',
				sort: 'none',
				expression: '',
			});
		return {
			data: data.data as {
				groupby: { [key: string]: string };
				unreadMessagesCount: number;
			}[],
			errors: data.errors,
		};
	}
	static deleteMessage(messageId: string) {
		return altogic.db.model('messages').object(messageId).delete();
	}
}

export default MessageService;
