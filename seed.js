const Products = require('./models/products')
const {db} = require('./models/index')
 
const seedAllProducts = [
   { name: 'Testing' },
   { name: 'Name 2' },
]
 
async function seed() {
   try {
       await db.sync({force: true})
       await Products.bulkCreate(seedAllProducts)
       await db.close()
   } catch (error) {
       console.log(error)
   }
}
 
seed()