const Sequelize = require('sequelize')
const db = new Sequelize('postgres://localhost:5432/skinRx-server', { logging: false })
 
module.exports = {
   db
  }
