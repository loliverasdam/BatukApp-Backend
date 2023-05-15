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

const getGenericEvents = (res, condition, utc) => {
    Event.findAll({
        ...genericEventBody,
        where: condition || {}
    })
    .then(result => res.json(result.map(e => {
        e.dataValues.start_date = moment(e.start_date).subtract(utc, 'hours').format("YYYY-MM-DD HH:mm:ss")
        return e;
    })))
    .catch(error => res.send(error).status(500))
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
// router.get('/year/:year/month/:month', (req, res) => {
//     let parsedDate = moment(`${req.params.year}-${req.params.month}-${req.query.day || 1}`, 'YYYY-MM-DD')
//     let endDate = moment(parsedDate).add(1, 'month').add(7, 'days')
//     let startDate = moment(parsedDate).subtract(7, 'days');

//     if (req.query.iduser)
//         User.findOne({ where: { iduser: req.query.iduser }, include: Band })
//         .then(user => {
//             getGenericEvents(res, { band_idband: user.bands.map(b => b.idband) })
//         })
//     else if (req.query.idband)
//         getGenericEvents(res, { band_idband: req.query.idband })
//     else
//         getGenericEvents(res, {})
// })

router.get('/community', (req, res) => {
    let now = moment()
    let parsedDate = moment(`${req.query.year || now.year()}-${req.query.month-1 || now.month()+1}-${req.query.day || now.date()}`, 'YYYY-MM-DD')

    getGenericEvents(res, {
        private: false,
        [Op.or]: [
            {
                start_date: { [Op.gte]: parsedDate }
            },
            {
                end_date: { [Op.gte]: parsedDate }
            }
        ]
    }, req.query.utc)
})

router.get('/calendar', (req, res) => {
    req.query.iduser
        ? User.findOne({ where: { iduser: req.query.iduser }, include: Band })
            .then(user => getGenericEvents(res, { band_idband: [req.query.idband, ...user.bands.map(b => b.idband)] }, req.query.utc))
        : getGenericEvents(res, { band_idband: [req.query.idband] }, req.query.utc)
})

router.get('/statuses', (req, res) => {
    res.json(Event.rawAttributes.status.values)
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
 *                                  type: start_date
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
        start_date: moment(req.body.start_date).add(req.query.utc, 'hours').format("YYYY-MM-DD HH:mm:ss"),
        end_date: req.body.end_date == null ? undefined : moment(req.body.end_date).utc().format("YYYY-MM-DD HH:mm:ss"),
        band_idband: req.body.idband,
        private: req.body.private,
        status: req.body.status,
        main_photo: req.body.main_photo
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
 *                              start_date:
 *                                  type: start_date
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
        start_date: moment(req.body.start_date).add(req.query.utc, 'hours').format("YYYY-MM-DD HH:mm:ss"),
        end_date: req.body.end_date == null ? undefined : moment(req.body.end_date).add(req.query.utc, 'hours').format("YYYY-MM-DD HH:mm:ss"),
        band_idband: req.body.idband,
        private: req.body.private,
        status: req.body.status,
        main_photo: req.body.main_photo
    })
    .then(result => res.json(result).status(200))
    .catch(error => res.send(error))
})


module.exports = router