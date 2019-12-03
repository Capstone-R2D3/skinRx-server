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

router.post('/', async (req, res, next) => {
    try {
        const {ingredientsToFind} = req.body;
        console.log('INGREDIENTS TO FIND: ', ingredientsToFind);
        let ingredientsData = [];
        for (let i = 0; i < ingredientsToFind.length; i++) {
            let ingredient = await Ingredients.find({
                where: {
                    name: ingredientsToFind[i]
                }
            })
            if (ingredient) {
                ingredientsData.push(ingredient);
            }
        }
        // const ingredientsData = ingredientsToFind.reduce(async (accum, ingredient) => {
        //     const data = await Ingredients.findOne({
        //         where: {
        //             name: ingredient
        //         }
        //     })
        //     if (data) {
        //         accum.push(data);
        //     }
        //     return accum;
        // }, []);
        res.json({ingredientsData})
    } catch (error) {
        next(error);
    }
})

module.exports = router;
