import { createClient } from 'altogic';

const ENV_URL = 'https://pn45-90sr.c1-europe.altogic.com';
const CLIENT_KEY = '7427b15c87f34ad9a80e16a382d7fd06';

const altogic = createClient(ENV_URL, CLIENT_KEY, {
	signInRedirect: '/login',
});

export default altogic;
