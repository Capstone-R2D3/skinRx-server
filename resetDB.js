// get models from associations tab since we want the associations attached to each model 
const {Users, Products, ProductReviews, SkinTypes} = require('./models/associations')
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
 
async function seed() {
   try {
       await db.sync({force: true})
       await Users.bulkCreate(seedUsers)
       await SkinTypes.bulkCreate(seedTypes)
       await db.close()
       console.log('database reset!')
   } catch (error) {
       console.log(error)
   }
}
 
seed()