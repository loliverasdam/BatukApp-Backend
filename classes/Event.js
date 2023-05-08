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
    },
    private: {
        type: Sequelize.BOOLEAN
    },
    status: {
        type: ENUM('Per confirmar','Confirmat','Anulat','Acabat')
    }
}, {tableName: 'event'})

module.exports = Event