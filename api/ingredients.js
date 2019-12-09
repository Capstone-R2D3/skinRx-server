const {Ingredients} = require('../models/associations');
const router = require('express').Router();

router.post('/', async (req, res, next) => {
    try {
        const ingredientsToFind = req.body.ingredients;
        let ingredientsData = [];
        for (let i = 0; i < ingredientsToFind.length; i++) {
            let ingredient = await Ingredients.findOne({
                where: {
                    name: ingredientsToFind[i]
                }
            })
            if (ingredient) {
                ingredientsData.push(ingredient);
            }
        }
        res.json(ingredientsData);
    } catch (error) {
        next(error);
    }
})

module.exports = router;
