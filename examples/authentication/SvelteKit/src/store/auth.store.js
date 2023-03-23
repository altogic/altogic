import { writable } from 'svelte/store';

export const authStore = writable(undefined);
export const sessionStore = writable(undefined);
