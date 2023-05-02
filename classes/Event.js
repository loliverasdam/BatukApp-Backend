const Sequelize = require('sequelize')
const db = require('../connection')

const Event = db.define('event', {
    idevent: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    },
    location: {
        type: Sequelize.STRING
    },
    datetime: {
        type: Sequelize.DATE
    }
}, {tableName: 'event'})

module.exports = Event