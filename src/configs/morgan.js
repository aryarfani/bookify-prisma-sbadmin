const morgan = require('morgan')
const logger = require('./logger')

morgan.token('body', (req, res) => JSON.stringify(req.body))
morgan.token('message', (req, res) => res.locals.errorMessage || '')

const getIpFormat = () => (process.env.NODE_ENV === 'production' ? ':remote-addr - ' : '')
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms :body`
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms :body - message: :message`

const successHandler = morgan(successResponseFormat, {
	skip: (req, res) => res.statusCode >= 400,
	stream: { write: (message) => logger.info(message.trim()) },
})

const errorHandler = morgan(errorResponseFormat, {
	skip: (req, res) => res.statusCode < 400,
	stream: { write: (message) => logger.error(message.trim()) },
})

module.exports = {
	successHandler,
	errorHandler,
}
