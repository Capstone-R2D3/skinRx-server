const Sequelize = require('sequelize')
const {db} = require('./index')

const ProductReviews = db.define('productReviews', {
  rating: {
    type: Sequelize.INTEGER
  }
})

module.exports = ProductReviews