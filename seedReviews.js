const {Users, Products, ProductReviews, SkinTypes, JourneyEntries} = require('./models/associations')
const {db} = require('./models/index')

const seedReviews = [
  { userId: 1, productId: 1, rating: 5 },
  { userId: 4, productId: 3, rating: 4 }, 
  { userId: 2, productId: 4, rating: 2 },
  { userId: 2, productId: 1, rating: 3 }, 
  { userId: 1, productId: 3, rating: 2 }, 
  { userId: 2, productId: 5, rating: 5 }, 
  { userId: 3, productId: 1, rating: 5 }, 
  { userId: 3, productId: 3, rating: 2 },
]

async function seed() {
  try {
      await db.sync()
      await ProductReviews.bulkCreate(seedReviews)
      await db.close()
      console.log('database reset!')
  } catch (error) {
      console.log(error)
  }
}
seed()