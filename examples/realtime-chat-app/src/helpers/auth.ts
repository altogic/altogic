import altogic from '../libs/altogic';
import { useAuthStore } from '../store';
import { User } from 'altogic';
const auth = altogic.auth;

export function login(email: string, password: string) {
	return auth.signInWithEmail(email, password);
}
export function register(email: string, password: string, name?: string) {
	return auth.signUpWithEmail(email, password, name);
}

export function logout(sessionToken?: string) {
	return auth.signOut(sessionToken);
}

export async function registerWithAcceptInvite({
	email,
	password,
	name,
	inviteToken,
}: {
	email: string;
	password: string;
	name?: string;
	inviteToken: string;
}) {
	const response = await register(email, password, name);
	if (response.user) {
		await altogic.endpoint.post(`/invite/accept/email`, {
			inviteToken,
			userId: response.user._id,
		});
	}
	return response;
}

export function verifyToken(token: string) {
	if (!token) return Promise.reject('No token found');
	return altogic.auth.getAuthGrant(token);
}

export async function setUserProfilePicture(picture: File) {
	const formData = new FormData();
	formData.append('picture', picture);
	const { data, errors } = await altogic.endpoint.put(
		'/users/profile-picture',
		formData,
		{},
		{
			Sessions: useAuthStore.getState().session?.token,
			'Content-Type': 'multipart/form-data',
		}
	);
	const user = data as User;
	return { data: user, errors };
}

export async function updateUserName(name: string) {
	const { data, errors } = await altogic.db.model('users').object(useAuthStore.getState().user?._id).update({ name });
	const user = data as User;
	return { data: user, errors };
}
