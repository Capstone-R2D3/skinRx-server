const Sequelize = require('sequelize')
const {db} = require('./index')

const Ingredients = db.define('ingredients', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  toxicity: {
    type: Sequelize.STRING,
    allowNull: false
  },
  data: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isIn: [['None', 'Limited', 'Fair', 'Good', 'Robust']]
    }
  }
})

module.exports = Ingredients
