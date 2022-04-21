const nodemailer = require('nodemailer')

exports.sendEmail = async function () {
	let testAccount = await nodemailer.createTestAccount()

	// create reusable transporter object using the default SMTP transport
	let transporter = nodemailer.createTransport({
		host: 'smtp.ethereal.email',
		port: 587,
		secure: false, // true for 465, false for other ports
		auth: {
			user: testAccount.user,
			pass: testAccount.pass,
		},
	})

	// send mail with defined transport object
	let mailInfo = await transporter.sendMail({
		from: '"Fred Foo 👻" <foo@example.com>', // sender address
		to: 'bar@example.com, baz@example.com', // list of receivers
		subject: 'Hello ✔', // Subject line
		text: 'Hello world?', // plain text body
		html: '<b>Hello world?</b>', // html body
	})

	console.log('Message sent: %s', mailInfo.messageId)
	console.log('Preview URL: %s', nodemailer.getTestMessageUrl(mailInfo))
}
