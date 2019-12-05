const { Users, Products, ProductReviews, Recommendations } = require('../models/associations');
const router = require('express').Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


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
      
      const cleanser = await Products.findByPk(currentRecs[0].cleanser)
      const toner = await Products.findByPk(currentRecs[0].toner)
      const moisturizer = await Products.findByPk(currentRecs[0].moisturizer)
      const serum = await Products.findByPk(currentRecs[0].serum)

      res.send({cleanser, toner, moisturizer, serum})
    } else {
      res.status(404).send('Could not find user')
    }
  } catch(error) {
    next(error)
  }
})

router.put('/update/:userId', async(req, res, next) => {
  try {
      const user = await Users.findByPk(req.params.userId);
      
      const skinTypeId = user.skinTypeId;    

      const cleanser = await Products.findAll({where: {category: 'Cleanser', skinTypeId}, limit: 1});
      const toner = await Products.findAll({where: {category: 'Toner', skinTypeId}, limit:1});
      const moisturizer = await Products.findAll({where: {category: 'Moisturizer', skinTypeId}, limit:1});
      const serum = await Products.findAll({where: {category: 'Serum', skinTypeId}, limit:1});

      console.log('cleanser', cleanser)

      try {
        await Recommendations.update(
          {
          cleanser: cleanser[0].id, 
          toner: toner[0].id, 
          moisturizer: moisturizer[0].id, 
          serum: serum[0].id, 
          userId: req.params.userId
          }, 
          {
            where: { userId: req.params.userId }
          }
          )
        res.json({cleanser, toner, moisturizer, serum })
      } catch (error) {
        next(error)
      }
  } catch(error) {
      next(error)
  }
})


router.put('/:userId', async(req, res, next) => {
  try {
    
    console.log('MADE IT TO THE BACK END!', req.body.category, req.body.productId, req.body.skinTypeId)

    // will be passed in through the product card in the body
    // do we need skintypeId since each product is only tied to a specific skin type currently?
    const category = req.body.category; 
    const productId = req.body.productId;
    const skinTypeId = req.body.skinTypeId;
    // const user1Rating = req.body.rating;
    const user1Rating = 4

    const similarRecs = await ProductReviews.findAll({ where: { productId: productId, userId: {[Op.not]: req.params.userId} }, limit: 5 })

    // console.log('similarRecs', similarRecs.data)

    async function findAndSend() {
        let newName = category.slice(0,1).toUpperCase() + category.slice(1)
        const newProduct = await Products.findAll({where: {category: newName, skinTypeId: req.body.skinTypeId}});

        const randomGenerator = Math.round(Math.random() * newProduct.length)
        let see = newProduct[randomGenerator]

        if(category.toLowerCase() === 'cleanser') await Recommendations.update({cleanser: see.id}, {where: { userId: req.params.userId } });
        else if(category.toLowerCase() === 'toner') await Recommendations.update({toner: see.id}, {where: { userId: req.params.userId } });
        else if(category.toLowerCase() === 'serum') await Recommendations.update({serum: see.id}, {where: { userId: req.params.userId } });
        else if(category.toLowerCase() === 'moisturizer') await Recommendations.update({moisturizer: see.id}, {where: { userId: req.params.userId } });
        
        let newRecommendation = await Products.findByPk(see.id)
        console.log('made a new rec!!!')
  
        res.send(newRecommendation)
    }


    if(similarRecs.length === 0) {
        findAndSend()
    } else {
      const user1Products = await ProductReviews.findAll({where: {userId: req.params.userId}})
      let user2Products
      let recommendProds = []
      

      for(let i = 0; i < similarRecs.length; i++) {
        user2Products = await ProductReviews.findAll({where: {userId: similarRecs[i].userId}})
        let match = getSameReviews(user1Products, user2Products)[0]
      

        if(match < 0.35) {
          findAndSend()
        }
        if(match >= 0.35) {
          let remainingArr = getSameReviews(user1Products, user2Products)[1];
          for(let i = 0; i < remainingArr.length; i++) {
            if(remainingArr[i].rating > 3) recommendProds.push(remainingArr[i].productId);
          }
        }
      }

    
      for(let i = 0; i < recommendProds.length; i++) {
        let productsToRecommend = await Products.findByPk(recommendProds[i]);
      
        // DEF NEED TO REFACTOR THIS BIT - DOES ANYONE KNOW IF I CAN JUST PASS IN A VARIABLE 
        // IN PLACE OF THE ACTUAL COLUMN NAME? THAT WOULD MAKE IT MUCH CLEANER!!!!!
        if(productsToRecommend['category'].toLowerCase() === category) {
          if(category === 'cleanser') await Recommendations.update({cleanser: recommendProds[i]}, {where: { userId: req.params.userId } });
          else if(category === 'toner') await Recommendations.update({toner: recommendProds[i]}, {where: { userId: req.params.userId } });
          else if(category === 'serum') await Recommendations.update({serum: recommendProds[i]}, {where: { userId: req.params.userId } });
          else if(category === 'moisturizer') await Recommendations.update({moisturizer: recommendProds[i]}, {where: { userId: req.params.userId } });
        
          let newRecommendation = await Products.findByPk(recommendProds[i])
          console.log('made it to the end & updated!')

          res.send(newRecommendation)
        }
      }

    }

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


