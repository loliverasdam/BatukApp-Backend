const express = require('express');
const router = express();
const Band = require('../classes/Band');
const User = require('../classes/User');
const UserBand = require('../classes/UserBand');
const Instrument = require('../classes/Instrument');

const genericUserBody = {
    include: [
        {
            model: UserBand,
            include: [
                {
                    model: Band,
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    }
                }
            ],
            attributes: ["role"]
        }
    ],
    attributes: {
        exclude: ["createdAt", "updatedAt"]
    }
}

router.get('/band/:idband', (req, res) => {
    User.findAll({
        // ...genericUserBody,
        attributes: {
            exclude: ["createdAt", "updatedAt"]
        },
        include: {
            model: UserBand,
            required: true,
            include: [
                {
                    model: Band,
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    },
                    where: {
                        idband: req.params.idband
                    }
                },
                {
                    model: Instrument,
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    },
                    through: {
                        attributes: ["main_instrument"]
                    }
                }
            ],
            attributes: {
                exclude: ["createdAt", "updatedAt", "user_iduser", "band_idband", "iduser_band"]
            }
        }
    })
    .then(result => {
        res.json(
            result.map(user => {
                let parsedInstruments = []
                user.user_bands[0].instruments.map(i => {
                    parsedInstruments.push({
                        ...i.dataValues,
                        main_instrument: i.dataValues.user_band_instrument.main_instrument,
                        user_band_instrument: undefined
                    })
                })
                return {
                    ...user.dataValues,
                    role: user.user_bands[0].role,
                    instruments: parsedInstruments,
                    user_bands: undefined
                }
            })
        )
    })
    .catch(error => res.send(error).status(500))
})

/**
 * GET A USER WITH CONDITIONS OR ALL USERS
 * 
 * @swagger
 * /users/email/:email:
 *      get:
 *          summary: Get a list of all the users that belong to a band
 *          parameters:
 *              - in: query
 *                name: email
 *                required: false
 *                type: string
 *              - in: query
 *                name: idband
 *                required: false
 *                type: integer
 *              - in: query
 *                name: iduser
 *                required: false
 *                type: integer
 *              - in: query
 *                name: google_id
 *                required: false
 *                type: string
 *          produces:
 *              - application/json
*/
router.get('/', (req, res) => {
    if(Object.keys(req.query).length <= 0) {
        User.findAll(genericUserBody)
        .then(result => res.json(result))
        .catch(error => res.send(error).status(500))
    }
    else {
        let condition = {}
        if (req.query.email) condition = { ...condition, email: req.query.email }
        if (req.query.iduser) condition = { ...condition, iduser: req.query.iduser }
        if (req.query.google_id) condition = { ...condition, google_id: req.query.google_id }

        User.findOne({
            ...genericUserBody,
            where: condition
        })
        .then(result => {
            if (result) {
                let parsedBands = []
                result.user_bands.map(uB => {
                    parsedBands.push({...uB.band.dataValues, role: uB.role })
                })
                res.json({...result.dataValues, user_bands: undefined, bands: parsedBands})
            }
            else res.json("User not found").status(404)
        })
        .catch(error => res.send(error).status(500))
    }

})

/**
 * CREATE USER
 *
 * @swagger
 * /users:
 *      post:
 *          summary: Create a new user or return it in case it already exists
 *          requestBody:
 *              description: Info about user to find/create
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              email:
 *                                  required: true
 *                                  type: string
 *                                  example: Si + Transport
 *                              name:
 *                                  required: false
 *                                  type: integer
 *                                  example: "Isaac Prats Renart"
 *          produces:
 *              - application/json
 */
router.post('/', (req, res) => {
/**
 * TODO
 *
 * Afegir el tema bandes, en plan, que pugi buscar si el correu pertany a una banda enlloc de un usuari i si quelcom
 * en manca l'atribut google_id li assigni.
 */

    User.findOne({
        ...genericUserBody,
        where: {
            email: req.body.email
        }
    })
    .then(user => {
        if (user == null) 
            return User.create({...req.body, google_id: req.body.id})
        else {
            let parsedBands = []
            user.user_bands.map(uB => {
                parsedBands.push({...uB.band.dataValues, role: uB.role })
            })
            return {...user.dataValues, user_bands: undefined, bands: parsedBands}
        }
    })
    .then(result => res.json(result))
    .catch(error => res.send(error).status(500))
})

/**
 * ASSIGN USER TO A BAND
 *
 * @swagger
 * /users/assign/user/:iduser/band/:idband:
 *      post:
 *          summary: Assign an existing user to an existing band
 *          requestBody:
 *              description: The id of both the user and the band you want to relate
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              iduser:
 *                                  type: integer
 *                                  example: 1
 *                              idband:
 *                                  type: integer
 *                                  example: 1
 *          produces:
 *              - application/json
 */
router.post('/assignBand', (req, res) => {
    BandHasUser.create({
        user_iduser: req.body.iduser,
        band_idband: req.body.idband,
        role: "Member"
    })
    .then(result => res.json(result))
    .catch(error => res.send(error).status(500))
})

router.put('/:google_id', (req, res) => {
    console.log(req.body)
    let update = {}

    if (req.body.name) update.name = req.body.name
    if (req.body.dni) update.dni = req.body.dni
    if (req.body.birth_date) update.birth_date = req.body.birth_date
    if (req.body.profile_photo) update.profile_photo = req.body.profile_photo

    User.update(update, {
        where: {
            google_id: req.params.google_id
        }
    })
    .then(_ => res.json("Correctly Updated").status(200))
    .catch(error => res.send(error).status(500))
})

module.exports = router;