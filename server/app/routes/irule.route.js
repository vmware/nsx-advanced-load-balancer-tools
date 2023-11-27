const controller = require('../controllers/irule.controller');
const express = require('express');
const router = express.Router();

router.get('/getSkippedIRules', controller.getSkippedIRules);
router.get('/getIRulesOverview', controller.getIRulesOverview);

module.exports = router;
