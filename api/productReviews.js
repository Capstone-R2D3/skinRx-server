const router = require('express').Router();
const ProductReviews = require('../models/productReviews');


router.post('/', async (req, res, next) => {
    try {
        const newRating = await ProductReviews.create(req.body);
        res.json(newRating);
    } catch(error) {
        next(error)
    }
})

module.exports = router