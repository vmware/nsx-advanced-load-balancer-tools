const controller = require('../controllers/core.controller');
const express = require("express");
const router = express.Router();

router.post('/getAviDestinationMappings', controller.getAviDestinationMappings);
router.get('/getAviLabDetails', controller.getAviLabDetails);
router.get('/getAviDestinationDetails', controller.getAviDestinationDetails);

module.exports = router;
