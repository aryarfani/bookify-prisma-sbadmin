const prisma = require('../../configs/prisma')
const { parseAssets } = require('../../prisma-helpers/jsonables')
const { BadRequestError } = require('../../utils/error.utils')
const { createTransaction } = require('../../utils/midtrans.utils')

exports.getOrders = async function (req, res) {
	let orders = await prisma.order.findMany({
		where: { customerId: req.user.id },
		include: {
			OrderItems: {
				include: { product: true },
			},
		},
	})
	parseAssets(orders)

	return res.json({ data: orders })
}

exports.checkoutOrder = async function (req, res) {
	// Validate cart exists
	let carts = await prisma.cart.findMany({
		where: { customerId: req.user.id },
		include: { product: true },
	})
	if (carts < 1) throw new BadRequestError('Cart is empty')

	// prepare order data
	let subtotal = 0
	let orderItems = carts.map((cart) => {
		subtotal += cart.product.price * cart.quantity

		return {
			productId: cart.productId,
			quantity: cart.quantity,
			price: cart.product.price,
		}
	})

	const midtransDetail = await prisma.$transaction(async (prisma) => {
		// save the order
		const order = await prisma.order.create({
			data: {
				customerId: req.user.id,
				code: 'bookify-' + Math.round(new Date().getTime() / 1000),
				subtotal: subtotal,
				note: req.body.note ?? '',
				OrderItems: {
					createMany: { data: orderItems },
				},
			},
		})

		// create midtrans invoice
		const midtransTransaction = await createTransaction(order)
		const midtransDetail = await prisma.midtransDetail.create({
			data: {
				code: order.code,
				paymentUrl: midtransTransaction.redirect_url,
				token: midtransTransaction.token,
			},
		})

		// clear the cart
		await prisma.cart.deleteMany({
			where: { customerId: req.user.id },
		})

		return midtransDetail
	})

	return res.json({
		message: 'Add Product to Cart Success',
		data: midtransDetail,
	})
}

exports.handleNotification = async function (req, res) {
	const payload = req.body
	console.log(payload)

	// define notification status
	const isPaid = ['capture', 'settlement'].includes(payload.transaction_status)

	// update midtransDetail
	await prisma.midtransDetail.update({
		where: { code: payload.order_id },
		data: {
			status: payload.transaction_status,
			paymentType: payload.payment_type,
			isPaid,
		},
	})

	// update order
	if (isPaid) {
		await prisma.order.update({
			where: { code: payload.order_id },
			data: { status: 'paid' },
		})
	} else {
		// failed logic
	}

	res.json({ success: true })
}
