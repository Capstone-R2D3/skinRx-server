const Sequelize = require('sequelize')
const {db} = require('./index')

const Products = db.define('products', {
  name: {
    type: Sequelize.STRING,
    allowNull: false, 
    validate: {
      notEmpty: true
    }
  }, 
  brand: {
    type: Sequelize.STRING,
    allowNull: false, 
    validate: {
      notEmpty: true
    }
  }, 
  organic: {
    type: Sequelize.BOOLEAN, 
    allowNull: false, 
    defaultValue: false
  }, 
  ingredient_list: {
    type: Sequelize.ARRAY(Sequelize.STRING)
  },
  imageUrl: {
    type: Sequelize.STRING,
    defaultValue: 'https://screenshotlayer.com/images/assets/placeholder.png'
  }
})

module.exports = Products