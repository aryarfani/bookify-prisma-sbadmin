const midtransClient = require('midtrans-client')

exports.createTransaction = async function (order) {
	// initialize snap client object
	let snap = new midtransClient.Snap({
		isProduction: false,
		serverKey: process.env.MIDTRANS_SERVER_KEY,
		clientKey: process.env.MIDTRANS_CLIENT_KEY,
	})

	let parameter = {
		transaction_details: {
			order_id: order.code,
			gross_amount: order.subtotal,
		},
		credit_card: {
			secure: true,
		},
	}

	// create snap transaction
	return await snap.createTransaction(parameter)
}
