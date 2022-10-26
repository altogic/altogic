/// <reference types="react-scripts" />
declare namespace NodeJS {
	interface ProcessEnv {
		NODE_ENV: 'development' | 'production' | 'test';
		REACT_APP_ALTOGIC_ENV_URL: string;
		REACT_APP_ALTOGIC_CLIENT_KEY: string;
		REACT_APP_ALTOGIC_API_KEY: string;
	}
}
