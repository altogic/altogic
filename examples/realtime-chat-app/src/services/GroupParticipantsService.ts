import altogic from '../libs/altogic';
import { GroupParticipant } from '../types';
import { groupBy } from 'lodash';
import { User } from 'altogic';

class GroupParticipantsService {
	static async getParticipantsByUserId(userId: string) {
		const response = await altogic.db
			.model('groupParticipants')
			.filter(`user == '${userId}'`)
			.lookup({ field: 'group' })
			.sort('group.lastMessageDate', 'desc')
			.limit(200)
			.get();
		return {
			participants: response.data as GroupParticipant[],
			errors: response.errors,
		};
	}

	static async getParticipantsByGroupId(groupId: string | string[]) {
		const filter = Array.isArray(groupId)
			? groupId.map(id => `group == '${id}'`).join(' || ')
			: `group == '${groupId}'`;

		const response = await altogic.db
			.model('groupParticipants')
			.filter(filter)
			.lookup({ field: 'user' })
			.limit(200)
			.get();

		const members = groupBy(response.data, 'group');
		for (let key in members) {
			// @ts-ignore
			members[key] = members[key].map(member => member.user);
		}

		return {
			members: members as { [groupId: string]: User[] },
			errors: response.errors,
		};
	}

	static async getParticipantsById(id: string) {
		const response = await altogic.db
			.model('groupParticipants')
			.filter(`_id == '${id}'`)
			.lookup({
				field: 'group',
			})
			.lookup({ field: 'user' })
			.getSingle();

		return {
			participants: response.data as GroupParticipant,
			errors: response.errors,
		};
	}
}

export default GroupParticipantsService;
