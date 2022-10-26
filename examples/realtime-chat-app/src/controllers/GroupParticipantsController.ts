import { GroupParticipantsService } from '../services';
import { useGroupStore, useMessageStore } from '../store';
import { GroupParticipant } from '../types';

export default class GroupParticipantsController {
	/**
	 * Gets all the groups and participants for the given user
	 */
	static async getGroupsAndParticipantsByUserId(userId: string) {
		useGroupStore.setState({ groupsLoading: true, chatsError: null });
		const { participants, errors } = await GroupParticipantsService.getParticipantsByUserId(userId);
		if (!errors) {
			const groupIds = participants.map(participant => participant.group._id);
			const { members } = await GroupParticipantsService.getParticipantsByGroupId(groupIds);

			const groups = participants.map(participant => ({
				...participant,
				members: members[participant.group._id].map(member => ({ ...member, isTyping: false })),
			})) as GroupParticipant[];

			useGroupStore.setState({
				groupsLoading: false,
				groups,
				groupsCount: groups.length,
			});
			groups.forEach(group => useMessageStore.getState().fetchMessages(group.group._id));
			return groups;
		}
	}
}
