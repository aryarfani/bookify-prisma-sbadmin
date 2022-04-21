exports.showLoginForm = async function (req, res) {
	res.render('login', {
		title: 'Login',
		layout: false,
		error: req.flash('error'),
	})
}

exports.login = async function (req, res) {
	if (req.body.name != 'admin@gmail.com' && req.body.password != 'secret123') {
		req.flash('error', 'Invalid email or password')
		return res.redirect('/login')
	}

	req.session.user = {
		name: 'admin',
		email: 'admin@gmail.com',
	}

	res.redirect('/index')
}

exports.logout = async function (req, res) {
	req.session.destroy()

	res.redirect('/login')
}
