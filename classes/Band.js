const Sequelize = require('sequelize')
const db = require('../connection')
const Song = require('./Song')
const Event = require('./Event')

const Band = db.define('band', {
    idband: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING
    },
    location: {
        type: Sequelize.STRING
    }
}, {tableName: 'band'})

/** Relation Band-Song **/
Band.hasMany(Song, {
    foreignKey: "band_idband"
})

Song.belongsTo(Band, {
    foreignKey: "band_idband"
})

/** Relation Band-Event **/
Band.hasMany(Event, {
    foreignKey: "band_idband"
})

Event.belongsTo(Band, {
    foreignKey: "band_idband"
})

module.exports = Band