const Sequelize = require('sequelize')
const { db } = require('./index')

const SkinTypes = db.define('skinTypes', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            isIn: [['Normal', 'Dry', 'Oily', 'Combination', 'Sensitive']]
        }
    }
})

module.exports = SkinTypes
