import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { APIError } from 'altogic';
import { GroupParticipant, UserWithTyping } from '../types';
import { GroupParticipantsController } from '../controllers';

interface GroupStore {
	groupsLoading: boolean;
	chatsError: APIError | null;
	groupsCount: number;
	groups: GroupParticipant[];
	addGroup: (group: GroupParticipant) => void;
	fetchGroups: (userId: string) => Promise<GroupParticipant[] | undefined>;
	updateGroupPicture: (groupId: string, profilePicture: string) => void;
	updateGroupName: (groupId: string, name: string) => void;
	setGroupMemberTyping: (groupId: string, userId: string, isTyping: boolean) => void;
	updateGroupLastMessageDate: (groupId: string, lastMessageDate: string) => void;
	setGroupMemberLastSeenAt: (userId: string, lastSeenAt: string) => void;
	setGroupMemberName: (userId: string, name: string) => void;
	setGroupMemberProfilePicture: (userId: string, profilePicture: string) => void;
	removeGroup: (groupId: string) => void;
	removeMember: (groupId: string, userId: string) => void;
	addMember: (groupId: string, user: UserWithTyping | UserWithTyping) => void;
}

const useGroupStore = create<GroupStore>()(
	devtools(
		set => ({
			groupsLoading: false,
			chatsError: null,
			groups: [],
			groupsCount: 0,
			addGroup: (group: GroupParticipant) => {
				set(state => ({
					groups: [group, ...state.groups],
					groupsCount: state.groupsCount + 1,
				}));
			},
			fetchGroups: userId => {
				return GroupParticipantsController.getGroupsAndParticipantsByUserId(userId);
			},
			updateGroupPicture: (groupId: string, profilePicture: string) => {
				set(state => ({
					groups: state.groups.map(group => {
						if (group.group._id === groupId) {
							group.group.profilePicture = profilePicture;
						}
						return group;
					}),
				}));
			},
			updateGroupName: (groupId: string, name: string) => {
				set(state => ({
					groups: state.groups.map(group => {
						if (group.group._id === groupId) {
							group.group.name = name;
						}
						return group;
					}),
				}));
			},
			setGroupMemberTyping: (groupId: string, userId: string, isTyping: boolean) => {
				set(state => {
					const groups = state.groups.map(item => {
						if (item.group._id === groupId) {
							item.members = item.members.map(member => {
								if (member._id === userId) {
									member.isTyping = isTyping;
								}
								return member;
							});
						}
						return item;
					});
					return { groups };
				});
			},
			updateGroupLastMessageDate: (groupId: string, lastMessageDate: string) => {
				set(state => {
					const groups = state.groups.map(item => {
						if (item.group._id === groupId) {
							item.group.lastMessageDate = lastMessageDate;
						}
						return item;
					});
					return { groups };
				});
			},
			setGroupMemberLastSeenAt: (userId: string, lastSeenAt: string) => {
				set(state => {
					const groups = state.groups.map(item => {
						item.members = item.members.map(member => {
							if (member._id === userId) {
								member.lastSeenAt = lastSeenAt;
							}
							return member;
						});
						return item;
					});
					return { groups };
				});
			},
			setGroupMemberName: (userId: string, name: string) => {
				set(state => {
					const groups = state.groups.map(item => {
						item.members = item.members.map(member => {
							if (member._id === userId) {
								member.name = name;
							}
							return member;
						});
						return item;
					});
					return { groups };
				});
			},
			setGroupMemberProfilePicture: (userId: string, profilePicture: string) => {
				set(state => {
					const groups = state.groups.map(item => {
						item.members = item.members.map(member => {
							if (member._id === userId) {
								member.profilePicture = profilePicture;
							}
							return member;
						});
						return item;
					});
					return { groups };
				});
			},
			removeGroup: (groupId: string) => {
				set(state => {
					const groups = state.groups.filter(group => group.group._id !== groupId);
					return { groups };
				});
			},
			removeMember: (groupId: string, userId: string) => {
				set(state => {
					const groups = state.groups.map(item => {
						if (item.group._id === groupId) {
							item.members = item.members.filter(member => member._id !== userId);
						}
						return item;
					});
					return { groups };
				});
			},
			addMember: (groupId: string, user: UserWithTyping | UserWithTyping[]) => {
				set(state => {
					const newUsers = (Array.isArray(user) ? user : [user]).map(user => ({ ...user, isTyping: false }));
					const groups = state.groups.map(item => {
						if (item.group._id === groupId) item.members = [...newUsers, ...item.members];
						return item;
					});
					return { groups };
				});
			},
		}),
		{
			name: 'group-storage',
		}
	)
);

export default useGroupStore;
