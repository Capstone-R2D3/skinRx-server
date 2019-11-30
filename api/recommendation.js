const { Users, Products, ProductReviews, Recommendations } = require('../models/associations');
const router = require('express').Router();


// finds similarity score between the two users 
const euclideanDistance = (user1, user2) => {
  const n = user1.length
  if (n === 0) return n

  let coefficient = 0
  for (let i = 0; i < n; i++) {
    coefficient += Math.pow(user1[i].rating - user2[i].rating, 2)
  }

  return 1 / (1 + Math.sqrt(coefficient))
}


// compares both users and returns array of product ids they both have reviews for 
const getSameReviews = (user1, user2) => {
  let sameReviews = []

  let user1ProdId = []
  for(let i = 0; i< user1.length; i++) {
    user1ProdId.push(user1[i].productId)
  }

  let user2ProdId = []
  for(let i = 0; i< user2.length; i++) {
    user2ProdId.push(user2[i].productId)
  }

  let longestArr = user1.length > user2.length ? user1ProdId : user2ProdId;
  let shorestArr = user1.length < user2.length ? user1ProdId : user2ProdId;

  for(let i = 0; i < longestArr.length; i++) {
    if(shorestArr.includes(longestArr[i])) {
      sameReviews.push(longestArr[i])
    }
  }

  let user1All = user1.filter(review => {
    if (sameReviews.includes(review.productId)) {
      return review
    }
  })

  let user2All = user2.filter(review => {
    if (sameReviews.includes(review.productId)) {
      return review
    }
  })

  let user2Remaining = user2.filter(review => {
    if (!(sameReviews.includes(review.productId))) {
      return review
    }
  })

  return [euclideanDistance(user1All, user2All), user2Remaining]
}


// *** ROUTES START HERE ***

// loading recommendations page for existing users 
router.get('/:userId', async(req, res, next) => {
  try {
    const user = await Users.findByPk(req.params.userId);
    console.log('found user')
    if(user) {
      const currentRecs = await Recommendations.findAll({where: { userId: req.params.userId } })
      res.send(currentRecs[0])
    } else {
      res.status(404).send('Could not find user')
    }
  } catch(error) {
    next(error)
  }
})



// update recommendations for each product when a rating has been submitted 
// things to consider: getting for each product - can we get the product category from the front end 
// and send it to this router?
// will need to use euclidean distance from here - first randomly select a person with a similar skin type 
// then feed into the equation. Similar score? then filter through the second person's recommendations from the same 
// category and give them that item if it is rated over a four. Otherwise, look for another person
router.put('/:userId', async(req, res, next) => {
  try {
    
    // will be passed in through the product card in the body
    const category = req.body.category; 
    const productId = req.body.productId;
    const skinTypeId = req.body.skinTypeId;
    // const user1Rating = req.body.rating;
    const user1Rating = 4

    const similarRecs = await ProductReviews.findAll({ where: { productId: productId }, limit: 5 })

    const user1Products = await ProductReviews.findAll({where: {userId: req.params.userId}})
    let user2Products
    let recommendProds = []

    for(let i = 1; i < similarRecs.length; i++) {
      user2Products = await ProductReviews.findAll({where: {userId: similarRecs[i].userId}})
      let match = getSameReviews(user1Products, user2Products)[0]
      console.log(match)
      
      if(match >= 0.39) {
        let remainingArr = getSameReviews(user1Products, user2Products)[1];
        for(let i = 0; i < remainingArr.length; i++) {
          if(remainingArr[i].rating > 3) recommendProds.push(remainingArr[i].productId);
        }
      }
    }

    console.log(recommendProds)
    for(let i = 0; i < recommendProds.length; i++) {
      let productsToRecommend = await Products.findByPk(recommendProds[i]);
      console.log(productsToRecommend.category)
      if(productsToRecommend['category'] === category) {
        console.log(userId)
        await Recommendations.update({cleanser: recommendProds[i]}, {where: { userId: req.params.userId } })
      }
    }

    res.send('hi')

  } catch(error) {
    next(error)
  }
})


// creating recommendations for new users
router.post('/:userId', async(req, res, next) => {
    try {
        const user = await Users.findByPk(req.params.userId);
        
        // ***** CHANGE THIS BACK LATER! Req.body when running from heroku, but user.SkinTypeId when from local host *****
        // const skinTypeId = req.body.skinTypeId
        const skinTypeId = user.skinTypeId;    

        const cleanser = await Products.findAll({where: {category: 'Cleanser', skinTypeId}, limit: 1});
        const toner = await Products.findAll({where: {category: 'Toner', skinTypeId}, limit:1});
        const moisturizer = await Products.findAll({where: {category: 'Moisturizer', skinTypeId}, limit:1});
        const serum = await Products.findAll({where: {category: 'Serum', skinTypeId}, limit:1});
        const mask = await Products.findAll({where: {category: 'Mask', skinTypeId}, limit:1});

        try {
          await Recommendations.create({
            cleanser: cleanser[0].id, 
            toner: toner[0].id, 
            moisturizer: moisturizer[0].id, 
            serum: serum[0].id, 
            mask: mask[0].id, 
            userId: req.params.userId
        })
          res.json({cleanser, toner, moisturizer, serum, mask})
        } catch (error) {
          next(error)
        }
    } catch(error) {
        next(error)
    }
})

module.exports = router;




// router.put('/:userId', async(req, res, next) => {
//   try {
    
//     // will be passed in through the product card in the body
//     const category = req.body.category; 
//     const productId = req.body.productId;
//     const skinTypeId = req.body.skinTypeId;
//     // const user1Rating = req.body.rating;
//     const user1Rating = 4

//     const similarRecs = await ProductReviews.findAll({ where: { productId: productId }, limit: 5 })
    
//     const user1Products = await ProductReviews.findAll({where: {userId: req.params.userId}})
//     const user2Products = await ProductReviews.findAll({where: {userId: similarRecs[1].userId}})

//     let match = getSameReviews(user1Products, user2Products)    

//     // if match is above this score then give back other recommendations from user 2 with high ratings
//     if (match > 0.40) {

//     } else {

//     }

//     res.send({user1Products, user2Products})

//   } catch(error) {
//     next(error)
//   }
// })
