import { createClient } from 'altogic';

const altogic = createClient(
	'https://012e-fo7m.c1-na.altogic.com',
	'9e6c5808bb2c4a60b0a1de4f5f12ea19',
	{
		realtime: {
			echoMessages: true,
		},
	}
);

export default altogic;
