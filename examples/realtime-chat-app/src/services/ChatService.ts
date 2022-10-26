import altogic from '../libs/altogic';
import { Chat, GroupParticipant } from '../types';

class ChatService {
	static async getRecentChats(userId: string, groupsFilter: string) {
		const response = await altogic.db
			.model('chats')
			.filter(
				`groupOrPerson == '${userId}' || belongsTo == '${userId}' ${groupsFilter ? `|| ${groupsFilter}` : ''}`
			)
			.lookup({
				name: 'group',
				modelName: 'groups',
				query: `this.groupOrPerson == lookup._id`,
			})
			.lookup({
				name: 'user',
				modelName: 'users',
				query: `this.groupOrPerson == lookup._id`,
			})
			.limit(200)
			.sort('createdAt', 'desc')
			.get();
		console.log(response.data);
		return {
			chats: response.data as Chat[],
			errors: response.errors,
		};
	}
	static async createChat(groupOrPerson: string, belongsTo: string) {
		const response = await altogic.db.model('chats').create({
			groupOrPerson,
			belongsTo,
		});
		return {
			chat: response.data as Chat,
			errors: response.errors,
		};
	}
	static async getChatById(chatId: string) {
		const response = await altogic.db
			.model('chats')
			.filter(`_id == '${chatId}'`)
			.lookup({
				name: 'group',
				modelName: 'groups',
				query: `this.groupOrPerson == lookup._id`,
			})
			.lookup({
				name: 'user',
				modelName: 'users',
				query: `this.groupOrPerson == lookup._id`,
			})
			.limit(200)
			.get();
		const [chat] = response.data as Chat[];
		return {
			chat,
			errors: response.errors,
		};
	}
	static async getGroupIdsByParticipantId(userId: string) {
		const response = await altogic.db.model('groupParticipants').filter(`user == '${userId}'`).limit(200).get();
		const data = response.data as GroupParticipant[];
		return data.map(participant => participant.group);
	}
}

export default ChatService;
