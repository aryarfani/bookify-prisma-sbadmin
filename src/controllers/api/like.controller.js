const prisma = require('../../configs/prisma')
const { parseAssets } = require('../../prisma-helpers/jsonables')
const { vendorSelectables } = require('../../prisma-helpers/selectables')
const { NotFoundError } = require('../../utils/error.utils')

exports.toggleLikeProduct = async function (req, res) {
	// Validate product exists
	const productCount = await prisma.product.findUnique({
		where: { id: Number(req.params.id) },
	})
	if (productCount < 1) throw new NotFoundError('Product is not found')

	// Check if user has liked a product
	const isLiked =
		(await prisma.product.count({
			where: {
				id: Number(req.params.id),
				Likers: { some: { id: Number(req.user.id) } },
			},
		})) > 0

	if (!isLiked) {
		// Likes product
		await prisma.customer.update({
			where: { id: Number(req.user.id) },
			data: { Likes: { connect: { id: Number(req.params.id) } } },
		})

		return res.json({ message: 'Like product success' })
	} else {
		// Dislikes product
		await prisma.customer.update({
			where: { id: Number(req.user.id) },
			data: { Likes: { disconnect: { id: Number(req.params.id) } } },
		})

		return res.json({ message: 'Dislike product success' })
	}
}

exports.likeProducts = async function (req, res) {
	let products = await prisma.product.findMany({
		include: { vendor: vendorSelectables },
		where: { Likers: { some: { id: Number(req.user.id) } } },
	})
	parseAssets(products)

	return res.json({ data: products })
}
