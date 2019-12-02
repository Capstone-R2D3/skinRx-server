const {Ingredients} = require('../models/associations');
const router = require('express').Router();

// router.get('/', async (req, res, next) => {
//     try {
//         const ingredients = await Ingredients.findAll();
//         res.json(ingredients);
//     } catch (error) {
//         next(error);
//     }
// })

router.get('/', (req, res, next) => {
    try {
        const { ingredientsToFind } = req.body;
        const ingredientsData = ingredientsToFind.reduce(async (accum, ingredient) => {
            const data = await Ingredients.findOne({
                where: {
                    name: ingredient
                }
            })
            if (data) {
                accum.push(data);
            }
            return accum;
        }, []);
        res.json(ingredientsData)
    } catch (error) {
        next(error);
    }
})

module.exports = router;
