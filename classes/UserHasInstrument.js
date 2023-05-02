const Sequelize = require('sequelize')
const db = require('../connection')

const UserHasInstrument = db.define('user_has_instrument', {
    user_iduser: {
        type: Sequelize.INTEGER,
    },
    instrument_idinstrument: {
        type: Sequelize.INTEGER,
    }
}, {tableName: 'user_has_instrument'})

module.exports = UserHasInstrument