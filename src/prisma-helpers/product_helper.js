const prisma = require('../configs/prisma')

exports.addLikeAttribute = async (user, products) => {
	await Promise.all(
		products.map(async (product) => {
			// Add isLiked column
			product['isLiked'] =
				(await prisma.product.count({
					where: { id: product.id, Likers: { some: { id: Number(user.id) } } },
				})) > 0

			// Add Net Price
			product['netPrice'] = parseInt(0.8 * product.price)

			//* -------------------- Hide Attribute -------------------- *\\
			const keys = ['updatedAt']
			keys.forEach((key) => delete product[key])
		}),
	)
}
