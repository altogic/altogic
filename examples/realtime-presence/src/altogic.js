import { createClient } from 'altogic';

const altogic = createClient(
	'<your Altogic app base url>',
	'<your Altogic app client key>',
	{
		realtime: {
			echoMessages: true,
		},
	}
);

export default altogic;
