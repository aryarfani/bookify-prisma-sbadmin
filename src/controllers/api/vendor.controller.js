const bcrypt = require('bcryptjs')
const Joi = require('joi')
const { joiOptions } = require('../../utils/validation.utils')
const { parseAssets } = require('../../prisma-helpers/jsonables')
const { createToken } = require('../../utils/access_token.utils')
const prisma = require('../../configs/prisma')

exports.index = async function (req, res) {
	let vendors = await prisma.vendor.findMany({
		include: { Products: true },
	})
	parseAssets(vendors)

	return res.json({ data: vendors })
}

exports.register = async function (req, res) {
	const { error, value } = Joi.object({
		name: Joi.string().required().max(200),
		email: Joi.string().email().required().max(200),
		password: Joi.string().required().max(200),
	}).validate(req.body, joiOptions)
	if (error) throw error

	// Validate email is unique
	const user = await prisma.vendor.findFirst({
		where: { email: value.email },
	})
	if (user != null) throw 'Email has been used'

	// Hash password
	value.password = bcrypt.hashSync(value.password)
	await prisma.vendor.create({ data: value })

	return res.json({ message: 'Register Success' })
}

exports.login = async function (req, res) {
	const { error, value } = Joi.object({
		email: Joi.string().email().required().max(200),
		password: Joi.string().required().max(200),
	}).validate(req.body, joiOptions)
	if (error) throw error

	// Validate user exists and password is correct
	const user = await prisma.vendor.findFirst({
		where: { email: value.email },
	})
	if (user != null) {
		let passwordMatch = bcrypt.compareSync(value.password, user.password)
		if (passwordMatch) {
			let token = await createToken('vendor', user.id)
			return res.status(200).json({
				message: 'Login Success',
				token: token,
			})
		}
	}

	return res.status(404).json({
		message: 'Username or password is incorrect',
	})
}

exports.update = async function (req, res) {
	const { error, value } = Joi.object({
		name: Joi.string().optional().max(200),
		email: Joi.string().email().optional().max(200),
		password: Joi.string().optional().max(200),
	}).validate(req.body, joiOptions)
	if (error) throw error

	// Validate email is unique
	const user = await prisma.vendor.findUnique({ where: { email: value.email } })
	if (user != null && user.id != req.user.id) {
		return res.status(400).json({ message: 'Email has been used' })
	}

	// Hash password
	if (value.password) {
		value.password = bcrypt.hashSync(value.password)
	}

	await prisma.vendor.update({
		where: { email: value.email },
		data: value,
	})

	return res.json({ message: 'Update Success' })
}

exports.me = async function (req, res) {
	return res.json({ data: req.user })
}
