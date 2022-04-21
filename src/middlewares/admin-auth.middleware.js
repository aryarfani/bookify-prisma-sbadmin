exports.adminAuthMiddleware = async (req, res, next) => {
	if (req.session.user) {
		console.log('adminAuthMiddleware', req.session.user)
		next()
	} else {
		req.flash('error', 'You need to login to access this page')
		return res.redirect('/login')
	}
}
