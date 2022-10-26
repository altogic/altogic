import altogic from '../libs/altogic';
import { User } from 'altogic';
import { _Message } from '../types';
const socket = altogic.realtime;

export function joinRoom(channel: string | string[]) {
	if (Array.isArray(channel)) {
		channel.forEach(c => socket.join(c));
	} else {
		socket.join(channel);
	}
}
export function setProfile(data: object) {
	socket.updateProfile(data);
}
export function sendMessage(channel: string, message: _Message) {
	socket.send(channel, 'message', message);
}
export function sendTyping(channel: string, user: User, typing: boolean) {
	socket.send(channel, 'typing', { user, typing });
}
export function onMessage(callback: (data: any) => void) {
	socket.on('message', callback);
}
export function offMessage(callback: (data: any) => void) {
	socket.off('message', callback);
}
export function onTyping(callback: (data: any) => void) {
	socket.on('typing', callback);
}
export function offTyping(callback: (data: any) => void) {
	socket.off('typing', callback);
}
