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
    defaultValue: 'https://screenshotlayer.com/images/assets/placeholder.png'
  },
  ingredients: {
    type: Sequelize.ARRAY(Sequelize.STRING)
  }
})

module.exports = Products