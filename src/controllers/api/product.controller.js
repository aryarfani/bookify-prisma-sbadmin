const Joi = require('joi')
const prisma = require('../../configs/prisma')
const { parseAssets } = require('../../prisma-helpers/jsonables')
const { vendorSelectables } = require('../../prisma-helpers/selectables')
const { BadRequestError } = require('../../utils/error.utils')
const { putFile } = require('../../utils/file.utils')
const { joiOptions } = require('../../utils/validation.utils')
const { addLikeAttribute } = require('../../prisma-helpers/product_helper')

exports.index = async function (req, res) {
	// Simple pagination by page
	const take = 5
	const skip = (req.query.page - 1 ?? 0) * take

	let products = await prisma.product.findMany({
		include: {
			vendor: vendorSelectables,
			_count: { select: { Likers: true } },
		},
		take: take,
		skip: skip,
	})
	parseAssets(products)
	await addLikeAttribute(req.user, products)

	return res.json({ data: products })
}

exports.store = async function (req, res) {
	const { error, value } = Joi.object({
		name: Joi.string().required().max(200),
		price: Joi.number().required(),
		stock: Joi.number().required(),
	}).validate(req.body, joiOptions)
	if (error) throw error

	// Validate image exist
	if (!req.files) throw new BadRequestError('No File Uploaded')
	if (!req.files.image.mimetype.startsWith('image')) {
		throw new BadRequestError('Please Upload Image')
	}

	value.image = await putFile(req.files.image)
	await prisma.product.create({
		data: {
			...value,
			vendor: { connect: { id: req.user.id } },
		},
	})

	return res.json({ message: 'Create Product Success' })
}

exports.update = async function (req, res) {
	const { error, value } = Joi.object({
		name: Joi.string().optional().max(200),
		price: Joi.number().optional(),
		stock: Joi.number().optional(),
	}).validate(req.body, joiOptions)
	if (error) throw error

	// When user uploads new image
	if (req.files) {
		if (!req.files.image.mimetype.startsWith('image')) {
			throw new BadRequestError('Please Upload Image')
		}
		req.body.image = await putFile(req.files.image)
	}

	await prisma.product.update({
		where: { id: Number(req.params.id) },
		data: value,
	})

	return res.json({ message: 'Update Product Success' })
}

exports.destroy = async function (req, res) {
	await prisma.product.delete({ where: { id: Number(req.params.id) } })

	return res.json({ message: 'Delete Product Success' })
}
