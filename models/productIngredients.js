const Sequelize = require('sequelize')
const {db} = require('./index')

const ProductIngredients = db.define('productIngredients', {
  productId: {
    type: Sequelize.INTEGER,
    allowNull: false
  }, 
  ingredientsId: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
})

module.exports = ProductIngredients