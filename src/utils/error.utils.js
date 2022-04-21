const { StatusCodes } = require('http-status-codes')

class BadRequestError extends Error {
	constructor(message) {
		super(message)
		this.statusCode = StatusCodes.BAD_REQUEST
	}
}

class NotFoundError extends Error {
	constructor(message) {
		super(message)
		this.statusCode = StatusCodes.NOT_FOUND
	}
}

class UnauthenticatedError extends Error {
	constructor(message) {
		super(message ?? 'Unauthenticated')
		this.statusCode = StatusCodes.UNAUTHORIZED
	}
}

class UnauthorizedError extends Error {
	constructor(message) {
		super(message ?? 'Unauthorized')
		this.statusCode = StatusCodes.FORBIDDEN
	}
}

module.exports = {
	UnauthenticatedError,
	NotFoundError,
	BadRequestError,
	UnauthorizedError,
}
