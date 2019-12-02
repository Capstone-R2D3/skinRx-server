const Sequelize = require('sequelize')
const {db} = require('./index')

const Products = db.define('products', {
  name: {
    type: Sequelize.STRING,
    // allowNull: false, 
    // validate: {
    //   notEmpty: true
    // }
  }, 
  brand: {
    type: Sequelize.STRING,
    // allowNull: false, 
    // validate: {
    //   notEmpty: true
    // }
  }, 
  category: {
    type: Sequelize.STRING, 
    // allowNull: false
  },
  imageUrl: {
    type: Sequelize.STRING,
    defaultValue: 'https://g.foolcdn.com/image/?url=https%3A%2F%2Fg.foolcdn.com%2Feditorial%2Fimages%2F518424%2Fskincare-products.jpg&w=700&op=resize'
  },
  ingredients: {
    type: Sequelize.ARRAY(Sequelize.STRING)
  }, 
  skinTypeId: {
    type: Sequelize.INTEGER,
  }
})

module.exports = Products