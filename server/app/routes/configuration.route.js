const controller = require('../controllers/configuration.controller');
const express = require("express");
const router = express.Router();

router.get('/getAllIncompleteVSMigrationData', controller.getAllIncompleteVSMigrationData);

router.get('/getLabControllerDetails', controller.getLabControllerDetails);

router.post('/updateMigrationData', controller.updateMigrationData);

router.post('/startMigration', controller.startMigration);

module.exports = router;
