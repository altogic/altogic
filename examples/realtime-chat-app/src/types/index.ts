import { User as AltogicUser } from 'altogic';

export interface User extends AltogicUser {
	lastSeenAt: string;
}
export interface UserWithTyping extends User {
	isTyping: boolean;
}
export interface Chat {
	_id: string;
	groupOrPerson: string;
	group?: Group;
	user?: User;
	belongsTo: string;
}
export interface Group {
	_id: string;
	name: string;
	profilePicture?: string;
	isPrivate: boolean;
	createdBy: User;
	lastMessageDate: string;
}
export interface Message {
	_id: string;
	content: string;
	media?: {
		type: string;
		url: string;
	};
	group: Group | string;
	sender: User | string;
	createdAt: string;
	isRead: boolean;
	updatedAt: string;
}
export interface GroupParticipant {
	group: Group;
	user: User;
	_id: string;
	createdAt: string;
	updatedAt: string;
	members: UserWithTyping[];
}
export interface Friend {
	_id: string;
	friend: User;
	user: User;
	isOnline?: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface _Message {
	_id: string;
	content: string;
	media?: {
		type: string;
		url: string;
	};
	isRead: boolean;
	group: string;
	sender: Partial<User>;
	createdAt: string;
	updatedAt: string;
}
export interface FriendNotification {
	_id: string;
	message: string;
	requester: User;
	belongsTo: User;
	isAccepted: boolean;
	createdAt: string;
	updatedAt: string;
}
export interface Invite {
	_id: string;
	requester: User;
	token: string;
	email: string;
	isAccepted: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface Notification {
	_id: string;
	belongsTo: string;
	message: string;
	isRead: boolean;
	createdAt: string;
	updatedAt: string;
}
