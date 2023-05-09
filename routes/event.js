const express = require('express');
const router = express();
const moment = require('moment');
const { Op } = require('sequelize');
const Band = require('../classes/Band');
const Event = require('../classes/Event');
const Assistance = require('../classes/Assistance');
const Instrument = require('../classes/Instrument');
const User = require('../classes/User');

const genericEventBody = {
    include: [
        {
            model: Band,
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            }
        },
        {
            model: Assistance,
            include: [
                {
                    model: Instrument,
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    }
                },
                {
                    model: User,
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    }
                }
            ],
            attributes: {
                exclude: ["updatedAt", "createdAt", "instrument_idinstrument", "user_iduser", "event_idevent"]
            }
        }
    ],
    attributes: {
        exclude: ["createdAt", "updatedAt", "band_idband"]
    }
}

/**
 * GET AN EVENT BY BAND ID FROM A CERTAIN MONTH
 * 
 * @swagger
 * /events/:idband/date/:month:
 *      get:
 *          summary: Get a list of all the events that belong to a band in a certain month (with a week margin before and after)
 *          parameters:
 *              - in: path
 *                name: idband
 *                required: true
 *                type: integer
 *                description: The ID from the band which you want to retrive the events from
 *              - in: path
 *                name: month
 *                required: true
 *                type: integer
 *                description: The month from the events you want to search
 *          produces:
 *              - application/json
 */
router.get('/year/:year/month/:month', (req, res) => {
    let parsedDate = moment(`${req.params.year}-${req.params.month}-${req.query.day || 1}`, 'YYYY-MM-DD')
    let endDate = moment(parsedDate).add(1, 'month').add(7, 'days')
    let startDate = moment(parsedDate).subtract(7, 'days');

    const getGenericEvents = condition => {
        Event.findAll({
            ...genericEventBody,
            where: {
                ...condition,
                datetime: req.query.day
                    ? { [Op.gte]: parsedDate }
                    : {
                        [Op.gte]: startDate,
                        [Op.lte]: endDate
                    }
            }
        })
        .then(result => res.json(result))
        .catch(error => res.send(error).status(500))
    }

    if (req.query.iduser)
        User.findOne({ where: { iduser: req.query.iduser }, include: Band })
        .then(user => {
            console.log(user.bands.map(b => b.idband))
            getGenericEvents({ band_idband: user.bands.map(b => b.idband) })
        })
    else if (req.query.idband)
        getGenericEvents({ band_idband: req.query.idband })
    else
        getGenericEvents({})
})

router.get("/:idevent", (req, res) => {
    Event.findOne({
        ...genericEventBody,
        where: {
            idevent: req.params.idevent
        }
    })
    .then(result => res.json(result))
    .catch(error => res.send(error).status(500))
})

/**
 * PUT AN EVENT INFO
 * 
 * @swagger
 * /events/:idevent:
 *      put:
 *          summary: Put the info about an existing event
 *          parameters:
 *              - in: path
 *                name: idevent
 *                required: true
 *                type: integer
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                                  example: Aniversari de la banda
 *                              description:
 *                                  type: string
 *                                  example: Festa per l'aniversari de la creació de la banda amb actuació en viu i molta cervesa
 *                              location:
 *                                  type: string
 *                                  example: C. de Sta. Eugènia, 146, 17006 Girona
 *                              datetime:
 *                                  type: datetime
 *                                  example: 27/08/2023 18:00:00
 *                              idband:
 *                                  type: integer
 *                                  example: 1
 */
router.put('/:idevent', (req, res) => {
    Event.update({
        name: req.body.name,
        description: req.body.description,
        location: req.body.location,
        datetime: req.body.datetime,
        band_idband: req.body.idband

    }, {
        where: {
            idevent: req.params.idevent
        }
    })
    .then(result => res.json(result).status(200))
    .catch(error => res.send(error))
})

/**
 * POST AN EVENT
 * 
 * @swagger
 * /events/:
 *      post:
 *          summary: Create a new event
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                                  example: Aniversari de la banda
 *                              description:
 *                                  type: string
 *                                  example: Festa per l'aniversari de la creació de la banda amb actuació en viu i molta cervesa
 *                              location:
 *                                  type: string
 *                                  example: C. de Sta. Eugènia, 146, 17006 Girona
 *                              datetime:
 *                                  type: datetime
 *                                  example: 27/08/2023 18:00:00
 *                              idband:
 *                                  type: integer
 *                                  example: 1
 */
router.post('/', (req, res) => {
    Event.create({
        name: req.body.name,
        description: req.body.description,
        location: req.body.location,
        datetime: req.body.datetime,
        band_idband: req.body.idband
    })
    .then(result => res.json(result).status(200))
    .catch(error => res.send(error))
})


module.exports = router