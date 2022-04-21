const { verifyToken } = require('../utils/access_token.utils')
const { UnauthenticatedError, UnauthorizedError } = require('../utils/error.utils')

exports.authMiddleware = async (req, res, next) => {
	// Validate token exists
	const authHeader = req.headers['authorization']
	const token = authHeader && authHeader.split(' ')[1]
	if (token == null) next(new UnauthenticatedError())

	// Validate token is active and assign it in req.user
	try {
		req.user = await verifyToken(token)
	} catch (err) {
		next(new UnauthenticatedError())
	}

	if (req.user == null) next(new UnauthorizedError())

	next()
}
