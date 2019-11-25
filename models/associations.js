const Users = require('./users')
const Products = require('./products')
const ProductReviews = require('./productReviews')


Products.belongsToMany(Users, { through: 'productReviews', unique: false })
Users.belongsToMany(Products, { through: 'productReviews', unique: false })
Users.hasMany(ProductReviews)

// Users.belongTo(Products)
// ProductReviews.hasMany(Users)

module.exports = {
  Users,
  Products,
  ProductReviews
}