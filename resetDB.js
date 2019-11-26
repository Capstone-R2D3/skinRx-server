// get models from associations tab since we want the associations attached to each model 
const {Users, Products, ProductReviews, SkinTypes, JourneyEntries} = require('./models/associations')
const {db} = require('./models/index')

const seedUsers = [
  { firstName: 'Andi', lastName: 'Plummer', email: 'andi@gmail.com', password: '1234' },
  { firstName: 'Grace', lastName: 'Chung', email: 'grace@gmail.com', password: '1234' },
  { firstName: 'Athena', lastName: 'Chen', email: 'athena@gmail.com', password: '1234' },
  { firstName: 'Sylvana', lastName: 'Santos', email: 'sylvana@gmail.com', password: '1234' },
]

const seedTypes = [
  { name: 'Oily' },
  { name: 'Dry' },
  { name: 'Combination' },
  { name: 'Normal' },
  { name: 'Sensitive' }
]

// const seedReviews = [
//   { userId: 1, productId: 1, rating: 5 },
//   { userId: 4, productId: 3, rating: 4 }, 
//   { userId: 2, productId: 4, rating: 2 },
//   { userId: 2, productId: 1, rating: 3 }, 
//   { userId: 1, productId: 3, rating: 2 }, 
//   { userId: 2, productId: 5, rating: 5 }, 
//   { userId: 3, productId: 1, rating: 5 }, 
//   { userId: 3, productId: 3, rating: 2 },
// ]

const seedJourneyEntries = [
  { date: 'November 26, 2019', stressLevel: 4.5, diet: 'cookies', description: 'Skin is acting up. Hormones, stress, sugar.', userId: 3 }
  ]
 
async function seed() {
   try {
       await db.sync({force: true})
       await Users.bulkCreate(seedUsers)
       await SkinTypes.bulkCreate(seedTypes)
      //  await ProductReviews.bulkCreate(seedReviews)
       await JourneyEntries.bulkCreate(seedJourneyEntries)
       await db.close()
       console.log('database reset!')
   } catch (error) {
       console.log(error)
   }
}
 
seed()