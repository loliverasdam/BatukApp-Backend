const express = require('express');
const router = express();
const Assistance = require('../classes/Assistance')

// TO GET ANSWER ENUM VALUES USE <Assistance.rawAttributes.answer.values>

/**
 * PUT ASSISTANCE FROM A USER IN AN EVENT
 * 
 * @swagger
 * /events/:idband/date/:month:
 *      put:
 *          summary: Modify the assistance and/or the instrument of a user in an event
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
 *          requestBody:
 *              description: Info about user assistance
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              answer:
 *                                  type: string
 *                                  example: Si + Transport
 *                              idinstrument:
 *                                  type: integer
 *                                  example: 7
 *          produces:
 *              - application/json
 */
router.put('/:idevent', (req, res) => {
    if (Array.isArray(req.body)) {
        let promises = []

        req.body.map(user => 
            promises.push(Assistance.update({
                answer: user.answer, 
                instrument_idinstrument: user.idinstrument
            }, {
                where: {
                    user_iduser: user.iduser,
                    event_idevent: req.params.idevent
                }
            }))
        )

        Promise.all(promises)
        .then(result => res.json(result).status(200))
        .catch(error => res.send(error).status(500))
    }
    else {
        Assistance.update({
            answer: req.body.answer, 
            instrument_idinstrument: req.body.idinstrument
        }, {
            where: {
                user_iduser: req.body.iduser,
                event_idevent: req.params.idevent
            }
        })
        .then(result => res.json(result).status(200))
        .catch(error => res.send(error).status(500))
    }
})

router.get('/responses', (_req, res) => {
    res.json(Assistance.rawAttributes.answer.values)
})

module.exports = router