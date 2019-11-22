const Users = require('./users')
const Products = require('./products')
const ProductReviews = require('./productReviews')

const Users = require('./users')
const Products = require('./products')

User.belongTo(Products)


Products.belongsToMany(Users, {
  through: 'productReviews',
  unique: false
})

User.hasMany(ProductReviews)
ProductReviews.hasMany(Users)

Users.belongsToMany(Products, {
  through: 'productReviews',
  unique: false
})

module.exports = {
  Users,
  Products,
  ProductReviews
}