import { GroupService } from '../services';
import { useAuthStore } from '../store';
import GroupParticipantsController from './GroupParticipantsController';
import altogic from '../libs/altogic';
import { User } from '../types';

class GroupController {
	/**
	 * Creates a new group with the given name and members
	 */
	static async createGroupWithParticipants(
		name: string,
		members: string[],
		isPrivate: boolean,
		profilePicture?: string
	) {
		const userId = useAuthStore.getState().user?._id;
		if (!userId) return;
		const data = { name, profilePicture, createdBy: userId, isPrivate };
		const { group, errors } = await GroupService.createGroup(data);
		if (!errors) {
			await GroupController.addParticipantsToGroup(group._id, [...members, userId]);
			const groupFromDB = await GroupParticipantsController.getGroupsAndParticipantsByUserId(userId);
			const lastGroup = groupFromDB?.find(g => g.group._id === group._id);
			members.forEach(member => altogic.realtime.send(member, 'new-group', lastGroup));
			return group;
		}
	}
	/**
	 * Updates the group profile picture
	 */
	static async updateGroupPicture(groupId: string, file: File) {
		const { data: image, errors: uploadErrors } = await altogic.storage.bucket('groups').upload(file.name, file, {
			isPublic: true,
			createBucket: false,
			contentType: file.type,
			tags: '',
			onProgress() {},
		});
		if (uploadErrors) throw new Error('We could not upload your image, please try again');

		// @ts-ignore
		const { errors } = await GroupService.updateGroupPicture(groupId, image?.publicPath);
		if (errors) throw new Error('We could not update your image, please try again');

		// @ts-ignore
		altogic.realtime.send(groupId, 'group-picture-updated', image?.publicPath);
	}
	/**
	 * Updates the group name
	 */
	static async updateGroupName(groupId: string, name: string) {
		const { errors } = await GroupService.updateGroupName(groupId, name);
		if (errors) throw new Error('We could not update your group name, please try again');
		altogic.realtime.send(groupId, 'group-name-updated', name);
	}
	/**
	 * Leaves the group
	 */
	static async leaveGroup(groupId: string) {
		const userId = useAuthStore.getState().user?._id;
		if (!userId) throw new Error('You are not logged in');
		const { errors } = await GroupService.leaveGroup(groupId, userId);
		if (errors) throw new Error('We could not leave the group, please try again');
		altogic.realtime.send(groupId, 'group-left', userId);
	}
	/**
	 * Deletes group
	 * @param groupId
	 */
	static async deleteGroup(groupId: string) {
		const userId = useAuthStore.getState().user?._id;
		if (!userId) throw new Error('You are not logged in');

		const { errors } = await GroupService.deleteGroup(groupId);
		if (errors) throw new Error('We could not delete the group, please try again');
		altogic.realtime.send(groupId, 'group-deleted', userId);
	}
	/**
	 * Adds participants to a group
	 */
	static async addParticipantsToGroup(groupId: string, members: string[] | User[]) {
		const data = members.map(user => ({ group: groupId, user: typeof user === 'string' ? user : user._id }));
		return GroupService.addParticipantsToGroup(data);
	}
}

export default GroupController;
