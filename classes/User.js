const Sequelize = require('sequelize')
const db = require('../connection')
const Instrument = require('./Instrument')
const UserHasInstrument = require('./UserBandInstrument')
const UserBand = require('./UserBand')

const User = db.define('user', {
    iduser: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    dni: {
        type: Sequelize.INTEGER
    },
    google_id: {
        type: Sequelize.STRING
    },
    birth_date: {
        type: Sequelize.DATE
    },
    profile_photo: {
        type: Sequelize.STRING
    }
}, {tableName: 'user'})

// /** Relation User-Instrument **/
// User.belongsToMany(Instrument, {
//     through: UserHasInstrument,
//     foreignKey: "user_iduser"
// })

// Instrument.belongsToMany(User, {
//     through: UserHasInstrument,
//     foreignKey: "instrument_idinstrument"
// })

/** Relation User-Band through BandHasUser **/
UserBand.belongsTo(User, {
    foreignKey: "band_idband"
})

User.hasMany(UserBand, {
    foreignKey: "user_iduser"
})

module.exports = User