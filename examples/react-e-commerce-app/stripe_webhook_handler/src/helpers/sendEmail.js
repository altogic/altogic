async function sendEmail(altogic, { toEmail, subject, html }) {
	return altogic.endpoint.post('/send/email', {
		toEmail,
		subject,
		html
	});
}

module.exports = sendEmail;
