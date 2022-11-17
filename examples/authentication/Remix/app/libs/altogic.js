import { createClient } from 'altogic';

const ENV_URL = 'https://pn45-90sr.c1-europe.altogic.com';
const CLIENT_KEY = '7427b15c87f34ad9a80e16a382d7fd06';
const API_KEY =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbnZJZCI6IjYzNWZiMGI3OTE4YjlmY2NmMzQ3ZjI2YiIsImtleUlkIjoiNjM1ZmIwYjk5MThiOWZjY2YzNDdmMjdjIiwiaWF0IjoxNjY3MjE1NTQ1LCJleHAiOjI1MzEyMTU1NDV9.wX7Feyf63WHsWRHQS3QNChyagRs07E0QK5TBwCjXHEE';

const altogic = createClient(ENV_URL, CLIENT_KEY, {
	apiKey: API_KEY,
	signInRedirect: '/login',
});

export default altogic;
