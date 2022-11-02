import { createClient } from 'altogic';

const ENV_URL = process.env.REACT_APP_ALTOGIC_ENV_URL;
const CLIENT_KEY = process.env.REACT_APP_ALTOGIC_CLIENT_KEY;
const API_KEY = process.env.REACT_APP_ALTOGIC_API_KEY;

const altogic = createClient(ENV_URL, CLIENT_KEY, {
	apiKey: API_KEY,
});

export default altogic;
