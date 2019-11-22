const Products = require('../models/products')
const router = require('express').Router()

router.get('/', async (req, res, next) => {
  try {
    console.log('here')
    const products = await Products.findAll()
    res.json(products)
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const newProduct = await Products.create(req.body);
    res.json(newProduct);
  } catch (error) {
    next(error)
  }
})

module.exports = router