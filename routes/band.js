const express = require('express');
const router = express();
const Band = require('../classes/Band');
const UserBandInstrument = require('../classes/UserBandInstrument');
const Event = require('../classes/Event');

const genericBandBody = {
    attributes: {
        exclude: ["createdAt", "updatedAt"]
    }
}

router.get('/test/', (req, res) => {
    UserBandInstrument.findAll()
    .then(result => res.json(result))
    .catch(error => res.send(error).status(500))
})

router.get('/public', (req, res) => {
    Band.findAll({
        include: {
            model: Event,
        where: {
                private: false
            },
            attributes: []
        },
        attributes: {
            exclude: ["createdAt", "updatedAt"]
        }
    })
    .then(result => res.json(result))
    .catch(error => res.send(error).status(500))
})

module.exports = router;