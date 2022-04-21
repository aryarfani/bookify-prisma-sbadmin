const { PrismaClientKnownRequestError } = require('@prisma/client/runtime')
const logger = require('../configs/logger')

exports.errorHandler = (err, req, res, next) => {
	if (err instanceof PrismaClientKnownRequestError) {
		return res.status(500).json({ error: err.meta.cause })
	}

	const statusCode = err.statusCode ?? 400

	// only show error stack in development mode
	const response = {
		code: statusCode,
		message: err.message,
		...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
	}

	if (process.env.NODE_ENV === 'development') {
		logger.error(err)
	}

	res.status(statusCode).send(response)
}
