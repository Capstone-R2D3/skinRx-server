const {SkinTypes} = require('../models/associations')
const router = require('express').Router()
module.exports = router

router.get('/:id', async (req, res, next) => {
  try {
    const type = await SkinTypes.findByPk(req.params.id)
    res.json(type)
  } catch (error) {
    next(error)
  }
})