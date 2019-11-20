const Sequelize = require('sequelize')
const db = new Sequelize('postgres://localhost:5432/skinrx-server', { logging: false })
 
module.exports = {
   db
  }
