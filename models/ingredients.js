const Sequelize = require('sequelize')
const {db} = require('./index')

const Ingredients = db.define('ingredients', {
  name: {
    type: Sequelize.STRING,
    allowNull: false, 
    validate: {
      notEmpty: true
    }
  }
})

module.exports = Ingredients