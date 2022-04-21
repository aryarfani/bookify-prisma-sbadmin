const router = require('express').Router()
const vendorController = require('../controllers/api/vendor.controller')
const customerController = require('../controllers/api/customer.controller')
const productController = require('../controllers/api/product.controller')
const cartController = require('../controllers/api/cart.controller')
const likeController = require('../controllers/api/like.controller')
const orderController = require('../controllers/api/order.controller')
const { authMiddleware } = require('../middlewares/auth.middleware')

// a global wrapper to wrap all function with try catch
const errorWrapper = (cb) => {
	return (req, res, next) => cb(req, res, next).catch(next)
}

//* -------------------- Unauthorized Middleware -------------------- *\\

// -- Products Route
router.use('/products', authMiddleware)
router.get('/products', errorWrapper(productController.index))
router.post('/products', errorWrapper(productController.store))
router.put('/products/:id', errorWrapper(productController.update))
router.delete('/products/:id', errorWrapper(productController.destroy))

// -- Likes Route
router.post('/products/likes/:id', errorWrapper(likeController.toggleLikeProduct))
router.get('/products/likes', errorWrapper(likeController.likeProducts))

// -- Vendors Route
router.get('/vendors', errorWrapper(vendorController.index))
router.post('/vendors/register', errorWrapper(vendorController.register))
router.post('/vendors/login', errorWrapper(vendorController.login))
router.use('/vendors', authMiddleware)
router.post('/vendors/update', errorWrapper(vendorController.update))
router.get('/vendors/me', errorWrapper(vendorController.me))

// -- Customers Route

// -- Customers Auth Route
router.get('/customers', errorWrapper(customerController.index))
router.post('/customers/register', errorWrapper(customerController.register))
router.post('/customers/login', errorWrapper(customerController.login))
router.use('/customers', authMiddleware)
router.post('/customers/update', errorWrapper(customerController.update))
router.get('/customers/me', errorWrapper(customerController.me))

// -- Customers Cart Route
router.get('/customers/carts', errorWrapper(cartController.getCarts))
router.post('/customers/carts', errorWrapper(cartController.addToCart))
router.delete('/customers/carts', errorWrapper(cartController.removeFromCart))

// -- Orders Cart Route
router.get('/customers/orders', errorWrapper(orderController.getOrders))
router.post('/customers/orders', errorWrapper(orderController.checkoutOrder))
router.post('/midtrans-callback', errorWrapper(orderController.handleNotification))

module.exports = router
