const controller = require('../controllers/core.controller');
const express = require("express");
const router = express.Router();

router.post('/getAviDestinationMappings', controller.getAviDestinationMappings);
router.get('/getAviLabDetails', controller.getAviLabDetails);
router.get('/getF5Details', controller.getF5Details);
router.get('/getAviDestinationDetails', controller.getAviDestinationDetails);
router.post('/saveAviLabDetails', controller.saveAviLabDetails);

module.exports = router;
