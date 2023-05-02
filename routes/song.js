const express = require('express');
const router = express();
const Song = require('../classes/Song');

const genericSongBody = {
    attributes: {
        exclude: ["createdAt", "updatedAt"]
    }
}

/**
 * GET A SONG BY BAND ID
 * 
 * @swagger
 * /songs/:idband:
 *      get:
 *          summary: Get a list of all the songs that belong to a band
 *          parameters:
 *              - in: path
 *                name: idband
 *                required: true
 *                type: integer
 *                description: The ID from the band you want to retrive the songs from
 *          produces:
 *              - application/json
 */
router.get('/:idband', (req, res) => {
    Song.findAll({
        ...genericSongBody,
        where: {
            band_idband: req.params.idband
        }
    })
    .then(result => res.json(result))
    .catch(error => res.send(error).status(500))
})

/**
 * GET A SONG BY ID
 * 
 * @swagger
 * /songs/id/:idsong:
 *      get:
 *          summary: Get a song
 *          parameters:
 *              - in: path
 *                name: idsong
 *                required: true
 *                type: integer
 *                description: The ID from the song you want to get
 *          produces:
 *              - application/json
 */
router.get('/id/:idsong', (req, res) => {
    Song.findAll({
        ...genericSongBody,
        where: {
            idsong: req.params.idsong
        }
    })
    .then(result => res.json(result))
    .catch(error => res.send(error).status(500))
})

module.exports = router