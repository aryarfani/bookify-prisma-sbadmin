const router = require('express').Router()
const productController = require('../controllers/web/product.controller')
const vendorController = require('../controllers/web/vendor.controller')
const adminController = require('../controllers/web/admin.controller')
const { adminAuthMiddleware } = require('../middlewares/admin-auth.middleware')

// a global wrapper to wrap all function with try catch
const errorWrapper = (cb) => {
	return (req, res, next) => cb(req, res, next).catch(next)
}

router.get('/login', errorWrapper(adminController.showLoginForm))
router.post('/login', errorWrapper(adminController.login))
router.use(adminAuthMiddleware)
router.post('/logout', errorWrapper(adminController.logout))

router.get('/', (_, res) => res.redirect('/index'))
router.get('/index', (_, res) => {
	res.render('index', { title: 'Index' })
})

router.get('/vendors', errorWrapper(vendorController.index))
router.get('/vendors/create', errorWrapper(vendorController.create))
router.get('/vendors/:id/edit', errorWrapper(vendorController.edit))
router.put('/vendors/:id', errorWrapper(vendorController.update))
router.post('/vendors', errorWrapper(vendorController.store))

module.exports = router
