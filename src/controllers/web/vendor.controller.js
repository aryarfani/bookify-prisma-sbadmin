const Joi = require('joi')
const { joiOptions } = require('../../utils/validation.utils')
const { parseAssets } = require('../../prisma-helpers/jsonables')
const prisma = require('../../configs/prisma')

exports.index = async function (req, res) {
	let vendors = await prisma.vendor.findMany({
		include: { Products: true },
	})
	parseAssets(vendors)

	return res.render('vendors/index', {
		title: 'Vendors',
		vendors,
		success: req.flash('success'),
		error: req.flash('error'),
	})
}

exports.create = async function (req, res) {
	return res.render('vendors/create', {
		title: 'Vendor Create',
		error: req.flash('error'),
	})
}

exports.store = async function (req, res) {
	const { error, value } = Joi.object({
		name: Joi.string().required().max(200),
		email: Joi.string().email().required().max(200),
		password: Joi.string().required().max(200),
	}).validate(req.body, joiOptions)
	if (error) {
		req.flash('error', error.message)
		return res.redirect('/vendors/create')
	}

	// Validate email is unique
	const user = await prisma.vendor.findFirst({
		where: { email: value.email },
	})
	if (user != null) {
		req.flash('error', 'Email has been used')
		return res.redirect('/vendors/create')
	}

	await prisma.vendor.create({ data: value })

	req.flash('success', 'Create Vendor Success')
	return res.redirect('/vendors')
}

exports.edit = async function (req, res) {
	const vendor = await prisma.vendor.findUnique({
		where: { id: Number(req.params.id) },
	})

	return res.render('vendors/edit', {
		title: 'Vendor Edit',
		vendor,
		error: req.flash('error'),
	})
}

exports.update = async function (req, res) {
	const { error, value } = Joi.object({
		name: Joi.string().optional().max(200),
		email: Joi.string().email().optional().max(200),
	}).validate(req.body, joiOptions)
	if (error) {
		req.flash('error', error.message)
		return res.redirect(`/vendors/${req.params.id}/edit`)
	}

	// Validate email is unique
	const user = await prisma.vendor.findUnique({ where: { email: value.email } })
	if (user != null && user.id != req.params.id) {
		req.flash('error', 'Email has been used')
		return res.redirect(`/vendors/${req.params.id}/edit`)
	}

	await prisma.vendor.update({
		where: { id: Number(req.params.id) },
		data: value,
	})

	req.flash('success', 'Update Vendor Success')
	return res.redirect('/vendors')
}
