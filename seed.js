// get models from associations tab since we want the associations attached to each model 
const {Users, Products, ProductReviews} = require('./models/associations')
const {db} = require('./models/index')
 
const seedAllProducts = [
   { name: 'Moisturizer', brand: 'Drunk Elephant', organic: false },
   { name: 'Toner', brand: 'The Ordinary', organic: false }, 
   { name: 'Cleanser', brand: 'Cetaphil', organic: false }
]

const seedUsers = [
  { firstName: 'Andi', lastName: 'Plummer', email: 'andi@gmail.com', password: '1234' },
  { firstName: 'Grace', lastName: 'Chung', email: 'grace@gmail.com', password: '1234' },
  { firstName: 'Athena', lastName: 'Chen', email: 'athena@gmail.com', password: '1234' },
  { firstName: 'Sylvana', lastName: 'Santos', email: 'sylvana@gmail.com', password: '1234' },
]

const seedRatings = [
  { userId: 1, productId: 1, rating: 5 },
  { userId: 4, productId: 3, rating: 4 }, 
  { userId: 2, productId: 1, rating: 2 }
]
 
async function seed() {
   try {
       await db.sync({force: true})
       await Products.bulkCreate(seedAllProducts)
       await Users.bulkCreate(seedUsers)
       await ProductReviews.bulkCreate(seedRatings)
       await db.close()
       console.log('seeding successful!')
   } catch (error) {
       console.log(error)
   }
}
 
seed()