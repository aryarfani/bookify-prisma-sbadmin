const Joi = require('joi')
const { joiOptions } = require('../utils/validation.utils')
const { parseAssets } = require('../prisma-helpers/jsonables')
const { vendorSelectables } = require('../prisma-helpers/selectables')
const { NotFoundError } = require('../utils/error.utils')
const prisma = require('../prisma/db')

exports.getCarts = async function (req, res) {
	let carts = await prisma.cart.findMany({
		where: { customerId: req.user.id },
		include: {
			product: {
				include: {
					vendor: vendorSelectables,
				},
			},
		},
	})
	parseAssets(carts)

	return res.json({ data: carts })
}

exports.addToCart = async function (req, res) {
	const { error, value } = Joi.object({
		productId: Joi.number().required(),
		quantity: Joi.number().optional().max(200),
	}).validate(req.body, joiOptions)
	if (error) throw error

	// Validate product existed
	const productCount = await prisma.product.findUnique({
		where: { id: Number(value.productId) },
	})
	if (productCount < 1) throw new NotFoundError('Product is not found')

	// Check if product is already in cart
	value.customerId = req.user.id
	const cart = await prisma.cart.findFirst({
		where: {
			customerId: req.user.id,
			productId: value.productId,
		},
	})

	// Update quantity if existed
	if (cart) {
		await prisma.cart.update({
			where: { id: cart.id },
			data: { quantity: value.quantity },
		})
	} else {
		await prisma.cart.create({ data: value })
	}

	return res.json({ message: 'Add Product to Cart Success' })
}

exports.removeFromCart = async function (req, res) {
	const { error, value } = Joi.object({
		productId: Joi.number().required(),
	}).validate(req.body, joiOptions)
	if (error) throw error

	await prisma.cart.deleteMany({
		where: {
			productId: value.productId,
			customerId: req.user.id,
		},
	})

	return res.json({ message: 'Delete Product from Cart Success' })
}
