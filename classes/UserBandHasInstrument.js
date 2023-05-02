const Sequelize = require('sequelize')
const db = require('../connection')

const UserBandHasInstrument = db.define('user_band_has_instrument', {
    main_instrument: {
        type: Sequelize.BOOLEAN,
    }
}, {tableName: 'user_band_has_instrument'})

module.exports = UserBandHasInstrument