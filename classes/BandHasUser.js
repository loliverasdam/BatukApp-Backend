const Sequelize = require('sequelize')
const db = require('../connection')

const BandHasUser = db.define('band_has_user', {
    band_idband: {
        type: Sequelize.INTEGER,
    },
    user_iduser: {
        type: Sequelize.INTEGER,
    },
    role: {
        type: Sequelize.ENUM('Admin','Editor','Member')
    }
}, {tableName: 'band_has_user'})

module.exports = BandHasUser