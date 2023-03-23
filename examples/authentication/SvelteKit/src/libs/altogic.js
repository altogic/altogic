import { createClient } from 'altogic';
import { PUBLIC_ALTOGIC_CLIENT_KEY, PUBLIC_ALTOGIC_ENV_URL } from '$env/static/public';

const altogic = createClient(PUBLIC_ALTOGIC_ENV_URL, PUBLIC_ALTOGIC_CLIENT_KEY, {
	signInRedirect: '/sign-in'
});

export default altogic;
