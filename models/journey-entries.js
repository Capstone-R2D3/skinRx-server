const Sequelize = require('sequelize')
const {db} = require('./index')

const JourneyEntries = db.define('journeyEntries', {
    date: {
        type: Sequelize.STRING,
        allowNull: false
    },
    imageUrls: {
        type: Sequelize.ARRAY(Sequelize.STRING),
    },
    stressLevel: {
        type: Sequelize.FLOAT,
        validate: {
            isFloat: true,
            max: 5,
            min: 1
        }
    },
    diet: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.TEXT
    }
})

module.exports = JourneyEntries;
