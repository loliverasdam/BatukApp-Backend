const Sequelize = require('sequelize');

const mysqlConnection = new Sequelize('batukapp', 'admin', 'pwdbatukapp', {
    host: 'batukapp-bdd.cfyeejfug09x.eu-west-3.rds.amazonaws.com',
    dialect:  'mysql'
});

mysqlConnection
    .authenticate()
    .then(() => console.log('Connection has been established successfully.'))
    .catch(err => console.error('Unable to connect to the database:', err));

module.exports = mysqlConnection;