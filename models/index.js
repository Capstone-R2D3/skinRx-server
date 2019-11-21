const Sequelize = require('sequelize')
if (process.env.DATABASE_URL) {
  // the application is executed on Heroku ... use the postgres database
  db = new Sequelize(process.env.DATABASE_URL, {
    dialect:  'postgres',
    protocol: 'postgres',
    logging:  false
  });
} else {
  // the application is executed on the local machine
  db = new Sequelize('postgres://localhost:5432/skinrx-server', {  logging: false });
}


module.exports = {
   db, 
}
