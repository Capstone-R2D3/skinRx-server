const Sequelize = require('sequelize')
const {db} = require('./index')

const Recommendations = db.define('recommendations', {
    cleanser: {
        type: Sequelize.INTEGER, 
        allowNull: false,
    }, 
    toner: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }, 
    moisturizer: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }, 
    mask: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }, 
    serum: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }, 
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }
})

module.exports = Recommendations;