const Ingredients = require('../models/associations');
const router = require('express').Router();

router.get('/', async (req, res, next) => {
    try {
        const ingredients = await Ingredients.findAll();
        res.json(ingredients);
    } catch (error) {
        next(error);
    }
})

module.exports = router;
