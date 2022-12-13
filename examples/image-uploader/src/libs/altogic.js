import { createClient } from 'altogic';

const ENV_URL = import.meta.env.VITE_ENV_URL;
const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY;

const altogic = createClient(ENV_URL, CLIENT_KEY, {
	signInRedirect: '/login',
});

const _altogic = createClient(ENV_URL, '9e7f21cd4f264c6da52113ba3c0e55b3');
export const uploadFile = (bucketName, fileName, file, options) => {
	return _altogic.storage.bucket(bucketName).upload(fileName, file, options);
};
export const createBucket = bucketName => {
	return _altogic.storage.createBucket(bucketName);
};

export default altogic;
