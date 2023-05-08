const express = require('express');
const router = express();
const Band = require('../classes/Band');
const UserBandInstrument = require('../classes/UserBandInstrument');

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

router.put('/:idband', (req, res) => {
    Band.update(req.body, {
        where: {
            idband: req.params.idband
        }
    })
    .then(result => res.json(result))
    .catch(error => res.send(error).status(500))
})

module.exports = router;