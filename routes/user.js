const express = require('express');
const router = express();
const Band = require('../classes/Band');
const User = require('../classes/User');
const Instrument = require('../classes/Instrument');
const BandHasUser = require('../classes/BandHasUser');

const genericUserBody = {
    include: [
        {
            model: Band,
            through: {
                attributes: ["role"]
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            }
        },
        {
            model: Instrument,
            through: {
                attributes: []
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            }
        }
    ],
    attributes: {
        exclude: ["createdAt", "updatedAt"]
    }
}

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
        if (req.query.idband) condition = { ...condition, idband: req.query.idband }
        if (req.query.iduser) condition = { ...condition, iduser: req.query.iduser }
        if (req.query.google_id) condition = { ...condition, google_id: req.query.google_id }

        User.findOne({
            ...genericUserBody,
            where: condition
        })
        .then(result =>
            result
                ? res.json(result).status(200)
                : res.json("User not found").status(404)
        )
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
    User.findOne({
        ...genericUserBody,
        where: {
            email: req.body.email
        }
    })
    .then(user => {
        if (user == null) 
            return User.create({...req.body, google_id: req.body.id})
        else
            return user
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

module.exports = router;