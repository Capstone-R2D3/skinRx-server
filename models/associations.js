const Users = require('./users')
const Products = require('./products')
const ProductReviews = require('./productReviews')
const SkinTypes = require('./skin-types')
const Recommendations = require('./recommendations')

const JourneyEntries = require('./journey-entries')

Products.belongsToMany(Users, { through: 'productReviews', unique: false })
Users.belongsToMany(Products, { through: 'productReviews', unique: false })

Users.hasMany(ProductReviews)

Users.belongsTo(SkinTypes)

Products.belongsTo(SkinTypes)

Recommendations.belongsTo(Users)
Users.hasOne(Recommendations)

Users.hasMany(JourneyEntries)
JourneyEntries.belongsTo(Users)

module.exports = {
  Users,
  Products,
  ProductReviews,
  SkinTypes,
  Recommendations,
  JourneyEntries
}
