const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
	// log: ['query'],
})

prisma.$on('query', (e) => {
	console.log('Params: ' + e.params)
	console.log('Duration: ' + e.duration + 'ms')
})

module.exports = prisma
