const express = require('express');
const router = express();
const Instrument = require('../classes/Instrument');
const Band = require('../classes/Band');

router.get("/:idband", (req, res) => {
    Instrument.findAll({
        include: {
            model: Band,
            where: {
                idband: req.params.idband
            }
        },
        attributes: {
            exclude: ["createdAt", "updatedAt"]
        }
    })
    .then(result => res.json(result.map(r => { return { ...r.dataValues, bands: undefined } })))
    .catch(error => res.send(error).status(500))
})

module.exports = router