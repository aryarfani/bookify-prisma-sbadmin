const path = require('path')

exports.putFile = async (file) => {
	const fileName = Date.now() + path.extname(file.name)
	const filePath = path.join(__dirname, '../public/files/' + fileName)
	await file.mv(filePath)

	return fileName
}
