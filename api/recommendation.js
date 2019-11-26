const { Users, Products, ProductReviews } = require('../models/associations');
const router = require('express').Router();


router.get('/reviews/:userId', async(req, res, next) =>{
    try {
        const user = await Users.findByPk(req.params.userId);
        const skinTypeId = user.skinTypeId;
        const reviews = await ProductReviews.findAll({where: {userId: req.params.userId}})
        if(!reviews) {
            const cleanser = await Products.findAll({where: {category: 'Cleanser', skinTypesId: skinTypeId}, limit:3});



        }
    } catch(error) {
        next(error)
    }
})


// router.get('/:userId', async(req, res, next) => {
//     try {
//         const user = await Users.findByPk(req.params.userId);
//         // const reviews = await ProductReviews.findAll({where: {userId: req.params.userId}})
//         const skinTypeId = user.skinTypeId;

        
//     } catch(error) {
//         next(error)
//     }
// });

module.exports = router;