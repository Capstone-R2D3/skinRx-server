const Products = require('./models/products')
const Users = require('./models/users')
const {db} = require('./models/index')
 
const seedAllProducts = [
   { name: 'Moisturizer', brand: 'Drunk Elephant', organic: false },
]

const seedUsers = [
  { firstName: 'Andi', lastName: 'Plummer', email: 'andi@gmail.com', password: '1234' },
  { firstName: 'Grace', lastName: 'Chung', email: 'grace@gmail.com', password: '1234' },
  { firstName: 'Athena', lastName: 'Chen', email: 'athena@gmail.com', password: '1234' },
  { firstName: 'Sylvana', lastName: 'Santos', email: 'sylvana@gmail.com', password: '1234' },
]
 
async function seed() {
   try {
       await db.sync({force: true})
       await Products.bulkCreate(seedAllProducts)
       await Users.bulkCreate(seedUsers)
       await db.close()
       console.log('seeding successful!')
   } catch (error) {
       console.log(error)
   }
}
 
seed()