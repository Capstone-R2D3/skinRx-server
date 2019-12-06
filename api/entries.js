const router = require('express').Router()
const JourneyEntries = require('../models/journey-entries')

<<<<<<< HEAD
router.get('/users/:userId/entries/:date', async (req, res, next) => {
    try {
      // const dateStr = req.params.date.split("-")
      // let newDate = `${dateStr[1]}/${dateStr[1]}/${dateStr[0]}`
      const oneEntry = await JourneyEntries.findAll({ where: { userId: req.params.userId, date: req.params.date }})
=======
router.get('/:userId/entries/:date', async (req, res, next) => {
    try {
      const dateStr = req.params.date.split("-")
      let newDate = `${dateStr[0]}/${dateStr[1]}/${dateStr[2]}`
      const oneEntry = await JourneyEntries.findAll({ where: { userId: req.params.userId, date: newDate }})
>>>>>>> 683d5c7f70f31fac434d18b5a8c7d098081028ce
      res.json(oneEntry)
    } catch (error) {
      next (error)
    }
  })

  module.exports = router