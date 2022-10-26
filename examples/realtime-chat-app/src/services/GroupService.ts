import altogic from '../libs/altogic';
import { Group, GroupParticipant } from '../types';

class GroupService {
	static async getParticipantsByGroupId(groupId: string) {
		const response = await altogic.db
			.model('groupParticipants')
			.filter(`group._id == '${groupId}'`)
			.lookup({
				field: 'user',
			})
			.lookup({
				field: 'group',
			})
			.get();
		return {
			members: response.data as GroupParticipant[],
			errors: response.errors,
		};
	}
	static async createGroup({
		name,
		profilePicture,
		isPrivate,
		createdBy,
	}: {
		name: string;
		profilePicture?: string;
		isPrivate?: boolean;
		createdBy: string;
	}) {
		const response = await altogic.db.model('groups').create({ name, profilePicture, createdBy, isPrivate });
		return {
			group: response.data as Group,
			errors: response.errors,
		};
	}
	static async addParticipantsToGroup(data: { group: string; user: string }[]) {
		const response = await altogic.db.model('groupParticipants').create(data);
		return {
			groupParticipants: response.data as GroupParticipant[],
			errors: response.errors,
		};
	}
	static updateGroupPicture(groupId: string, profilePicture: string) {
		return altogic.db.model('groups').object(groupId).update({ profilePicture });
	}
	static updateGroupName(groupId: string, name: string) {
		return altogic.db.model('groups').object(groupId).update({ name });
	}
	static update(groupId: string, data: Partial<Group>) {
		return altogic.db.model('groups').object(groupId).update(data);
	}
	static leaveGroup(groupId: string, userId: string) {
		return altogic.db.model('groupParticipants').filter(`group == '${groupId}' && user == '${userId}'`).delete();
	}
	static async deleteGroup(groupId: string) {
		const { errors } = await altogic.db.model('groups').object(groupId).delete();
		if (errors) return { errors };
		altogic.db.model('messages').filter(`group == '${groupId}'`).delete();
		altogic.db.model('groupParticipants').filter(`group == '${groupId}'`).delete();
		return { errors: null };
	}
}

export default GroupService;
