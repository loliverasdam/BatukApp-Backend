const Sequelize = require('sequelize')
const db = require('../connection')

const BandHasUser = db.define('band_has_user', {
    role: {
        type: Sequelize.ENUM('Admin','Editor','Member')
    }
}, {tableName: 'band_has_user'})

module.exports = BandHasUser