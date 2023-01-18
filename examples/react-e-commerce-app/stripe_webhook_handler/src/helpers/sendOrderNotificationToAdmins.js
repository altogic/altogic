const sendEmail = require('./sendEmail');

module.exports = async altogic => {
	const { data: admins, errors } = await altogic.db.model('users').filter(`isAdmin == true`).get();

	if (errors || admins.length === 0) {
		console.error(errors);
		return;
	}

	for (let admin of admins) {
		const { data, errors: emailErrors } = await sendEmail(altogic, {
			toEmail: admin.email,
			subject: 'New Order Arrived',
			html: `<h1>Hey Admin,</h1> <br> <p style='font-size: 20px'>There is a new order arrived. Please check your dashboard.</p>`
		});

		if (emailErrors) {
			return console.error(emailErrors);
		}
	}
};
