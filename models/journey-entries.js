const Sequelize = require('sequelize')
const {db} = require('./index')

const JourneyEntries = db.define('journeyEntries', {
    date: {
        type: Sequelize.STRING,
        allowNull: false
    },
    imageUrl: {
        type: Sequelize.STRING,
        defaultValue: 'https://cdn.imgbin.com/14/2/14/imgbin-cartoon-girl-skin-care-mask-7TXRD4K1yKn7iYbCgwzQWuqng.jpg'
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
