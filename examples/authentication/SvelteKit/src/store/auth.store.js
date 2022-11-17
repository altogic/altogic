import { altogic } from '../configs/altogic';
import { writable } from 'svelte/store';

export const authStore = writable(undefined);
export const sessionStore = writable(undefined);

// Check if user information is exist in storage
const userFromStorage = altogic.auth.getUser();
authStore.set(userFromStorage);
// Check if session information is exist in storage
const sessionFromStorage = altogic.auth.getSession();
sessionStore.set(sessionFromStorage);

// Set user information to storage when auth state's changed
authStore.subscribe((value) => {
	altogic.auth.setUser(value);
});
// Set session information to storage when session state's changed
sessionStore.subscribe((value) => {
	altogic.auth.setSession(value);
});
