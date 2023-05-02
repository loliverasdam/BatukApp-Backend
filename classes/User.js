const Sequelize = require('sequelize')
const db = require('../connection')
const Band = require('./Band')
const Instrument = require('./Instrument')
const BandHasUser = require('./BandHasUser')
const UserHasInstrument = require('./UserHasInstrument')

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
    }
}, {tableName: 'user'})

/** Relation User-Instrument **/
User.belongsToMany(Instrument, {
    through: UserHasInstrument,
    foreignKey: "user_iduser"
})

Instrument.belongsToMany(User, {
    through: UserHasInstrument,
    foreignKey: "instrument_idinstrument"
})

/** Relation User-Band through BandHasUser **/
Band.belongsToMany(User, {
    through: BandHasUser,
    foreignKey: "band_idband"
})

User.belongsToMany(Band, {
    through: BandHasUser,
    foreignKey: "user_iduser"
})

module.exports = User