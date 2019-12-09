const {Products} = require('../models/associations')
const router = require('express').Router()
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


// find a scanned product in db by name 
router.get('/name', async (req, res, next) => {
  try {
    console.log('req.query', req.query)
    const products = await Products.findAll({
      where: {
        name: {
          [Op.substring]: req.query.name
        }
      }
    })
    console.log('products by name', products)
    res.json(products)
  } catch (error) {
    next(error)
  }
})

router.get('/', async (req, res, next) => {
  try {
    console.log('here')
    const products = await Products.findAll()
    res.json(products)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const product = await Products.findOne({
      where: { id: req.params.id }
    })
    res.json(product)
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