const router = require('express').Router();
const {ProductReviews} = require('../models/associations');

router.get('/', async (req, res, next) => {
  try {
    const products = await ProductReviews.findAll()
    res.json(products)
  } catch (error) {
    next(error)
  }
})

router.get('/:userId/:productId', async (req, res, next) => {
  try {
    const rating = await ProductReviews.findAll({
      where: { 
        productId: req.params.productId,
        userId: req.params.userId
      }
    })
    res.json(rating)
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
    try {
        const newRating = await ProductReviews.create(req.body);
        res.json(newRating);
    } catch(error) {
        next(error)
    }
})

router.put('/:ratingId', async (req, res, next) => {
  try {
    const rating = await ProductReviews.findByPk({
      where: {id: req.params.ratingId}
    })
    res.json(rating)
  } catch (error) {
    next(error)
  }
})

module.exports = router