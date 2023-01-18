const { createClient } = require("altogic");

const ENV_URL = "https://o21b-w110.c1-europe.altogic.com";
const CLIENT_KEY = "9daf332fe81d44ecbcdb570fe885cbc4";
const altogic = createClient(ENV_URL, CLIENT_KEY);

module.exports = async function (req, res) {
	const { url, bucketName, filter, limit, page } = req.body
	const { errors: deleteErrors } = await altogic.storage.deleteFile(url);

	if (deleteErrors) {
		return res.json(deleteErrors, 500);
	}

	const { data } = await altogic.storage
		.bucket(bucketName)
		.listFiles(filter, {
			returnCountInfo: true,
			limit,
			page,
			sort: {
				field: 'uploadedAt',
				direction: 'desc',
			},
		});


	res.json(data);
};
