const Sequelize = require('sequelize')
const db = require('../connection')

const UserBandInstrument = db.define('user_band_instrument', {
    main_instrument: {
        type: Sequelize.BOOLEAN,
    }
}, {tableName: 'user_band_instrument'})

module.exports = UserBandInstrument