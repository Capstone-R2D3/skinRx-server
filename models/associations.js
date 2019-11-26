const Users = require('./users')
const Products = require('./products')
const ProductReviews = require('./productReviews')
const SkinTypes = require('./skin-types')
const JourneyEntries = require('./journey-entries')

Products.belongsToMany(Users, { through: 'productReviews', unique: false })
Users.belongsToMany(Products, { through: 'productReviews', unique: false })
Users.hasMany(ProductReviews)
Users.belongsTo(SkinTypes)
Users.hasMany(JourneyEntries)
JourneyEntries.belongsTo(Users)

module.exports = {
  Users,
  Products,
  ProductReviews,
  SkinTypes,
  JourneyEntries
}
