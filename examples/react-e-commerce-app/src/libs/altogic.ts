import { createClient } from 'altogic';

const ENV_URL = import.meta.env.VITE_APP_ALTOGIC_ENV_URL;
const CLIENT_KEY = import.meta.env.VITE_APP_ALTOGIC_CLIENT_KEY;
const CLIENT_KEY_ONLY_READ = import.meta.env.VITE_APP_ALTOGIC_CLIENT_KEY_ONLY_READ;

const altogic = createClient(ENV_URL, CLIENT_KEY, {
	signInRedirect: '/auth/login'
});

export const altogicOnlyRead = createClient(ENV_URL, CLIENT_KEY_ONLY_READ);

export default altogic;
