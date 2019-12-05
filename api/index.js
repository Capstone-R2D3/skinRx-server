const router = require('express').Router()
module.exports = router

router.use('/products', require('./products'))
router.use('/recommendations', require('./recommendation'))
router.use('/reviews', require('./productReviews'))
router.use('/ingredients', require('./ingredients'))
router.use('/skintypes', require('./skin-types'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
