const router = require('express').Router()
const JourneyEntries = require('../models/journey-entries')

router.get('/:userId/entries/:date', async (req, res, next) => {
    try {
      const dateStr = req.params.date.split("-")
      let newDate = `${dateStr[0]}/${dateStr[1]}/${dateStr[2]}`
      const oneEntry = await JourneyEntries.findAll({ where: { userId: req.params.userId, date: newDate }})
      res.json(oneEntry)
    } catch (error) {
      next (error)
    }
  })

  module.exports = router