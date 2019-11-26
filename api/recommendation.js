const { Users, Products, ProductReviews, Recommendations } = require('../models/associations');
const router = require('express').Router();
// const { euclideanDistance, getSameReviews } = require('../algo/index')


router.get('/:userId', async(req, res, next) =>{
    try {
        const user = await Users.findByPk(req.params.userId);
        const skinTypeId = user.skinTypeId;
        const reviews = await ProductReviews.findAll({where: {userId: req.params.userId}})
        
        if(reviews.length > 0) {
            

            res.json(reviews)
        }
        // else {
        //     const cleanser = await Products.findAll({where: {category: 'Cleanser', skinTypeId}, limit: 1});
        //     const toner = await Products.findAll({where: {category: 'Toner', skinTypeId}, limit:1});
        //     const moisturizer = await Products.findAll({where: {category: 'Moisturizer', skinTypeId}, limit:1});
        //     const serum = await Products.findAll({where: {category: 'Serum', skinTypeId}, limit:1});
        //     const mask = await Products.findAll({where: {category: 'Mask', skinTypeId}, limit:1});
            
        //     res.json({cleanser, toner, moisturizer, serum, mask})
        // }
        // res.send('hi')
    } catch(error) {
        next(error)
    }
})

router.post('/:userId', async(req, res, next) => {
    try {
        const user = await Users.findByPk(req.params.userId);
        const skinTypeId = user.skinTypeId;    

        const cleanser = await Products.findAll({where: {category: 'Cleanser', skinTypeId}, limit: 1});
        const toner = await Products.findAll({where: {category: 'Toner', skinTypeId}, limit:1});
        const moisturizer = await Products.findAll({where: {category: 'Moisturizer', skinTypeId}, limit:1});
        const serum = await Products.findAll({where: {category: 'Serum', skinTypeId}, limit:1});
        const mask = await Products.findAll({where: {category: 'Mask', skinTypeId}, limit:1});

        Recommendations.create({
            cleanser: cleanser[0].id, 
            toner: toner[0].id, 
            moisturizer: moisturizer[0].id, 
            serum: serum[0].id, 
            mask: mask[0].id, 
            userId: req.params.userId
        })

        res.json({cleanser, toner, moisturizer, serum, mask})
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