const controller = require('../controllers/core.controller');
const express = require("express");
const router = express.Router();

router.post('/getAviDestinationMappings', controller.getAviDestinationMappings);

module.exports = router;
