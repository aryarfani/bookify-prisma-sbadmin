const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const methodOverride = require('method-override')
const dotenv = require('dotenv')
const fileUpload = require('express-fileupload')
const helmet = require('helmet')
const morgan = require('./configs/morgan')
const { errorHandler } = require('./middlewares/error.middleware')
const { NotFoundError } = require('./utils/error.utils')
const logger = require('./configs/logger')
const compression = require('compression')
const expressLayouts = require('express-ejs-layouts')
const flash = require('express-flash')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const { PrismaSessionStore } = require('@quixo3/prisma-session-store')
const prisma = require('./configs/prisma')

// get config vars
dotenv.config()

// to serve image (static file)
app.use(express.static('public'))

// Set Templating Engine
app.use(expressLayouts)
app.set('layout', __dirname + '/../views/template/layouts/app')
app.set('view engine', 'ejs')
app.set('layout extractScripts', true)

// log req and res
app.use(morgan.successHandler)
app.use(morgan.errorHandler)

// gzip compression
app.use(compression())

// set security HTTP headers
app.use(
	helmet({
		contentSecurityPolicy: false,
		crossOriginEmbedderPolicy: false,
	}),
)

// parse file from multipartbody
app.use(fileUpload())

// parse urlencoded request body
app.use(express.json())

// parse request bodies (req.body)
app.use(express.urlencoded({ extended: true }))

// allow overriding methods in query (?_method=put)
app.use(methodOverride('_method'))

// flash message
app.use(cookieParser('secret'))
app.use(
	session({
		cookie: {
			maxAge: 7 * 24 * 60 * 60 * 1000, // ms
		},
		secret: 'secret',
		proxy: 'true',
		resave: false,
		saveUninitialized: false,
		store: new PrismaSessionStore(prisma, {
			checkPeriod: 2 * 60 * 1000, //ms
			dbRecordIdIsSessionId: true,
			dbRecordIdFunction: undefined,
		}),
	}),
)
app.use(flash())

//* -------------------- Routes -------------------- *\\

// assign app routes
app.use('/api', require('./routes/api'))

app.use('/', require('./routes/web'))

// global [errorWrapper] handler middleware
app.use(errorHandler)

// 404 since no middleware responded, hence final route
// --api
app.use('/api', function (_, _, next) {
	next(new NotFoundError('Those who wanders are sometimes lost'))
})
// --web
app.use('/*', function (_, res, _) {
	res.render('404', { title: '404', layout: false })
})

app.listen(PORT, function () {
	logger.info(`Server running on port ${PORT}`)
})
