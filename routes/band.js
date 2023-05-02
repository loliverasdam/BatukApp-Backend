const express = require('express');
const router = express();
const Band = require('../classes/Band');

const genericBandBody = {
    attributes: {
        exclude: ["createdAt", "updatedAt"]
    }
}

module.exports = router;