const crypto = require('crypto')
const prisma = require('../configs/prisma')

// Function that returns token and saved it to db
exports.createToken = async (modelName, modelId) => {
	const token = crypto.randomBytes(20).toString('hex')

	await prisma.accessToken.create({
		data: {
			token: token,
			modelName: modelName,
			modelId: modelId,
		},
	})

	return token
}

// Fuction that returns token user data
exports.verifyToken = async (token) => {
	const { modelName, modelId } = await prisma.accessToken.findFirst({
		where: { token },
	})

	// get prisma.modelName from saved token
	return await prisma[modelName].findUnique({
		where: { id: Number(modelId) },
	})
}
