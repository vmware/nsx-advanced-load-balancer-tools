const controller = require('../controllers/migration.controller');
const express = require("express");
const router = express.Router();

router.get('/getConfiguration', controller.getConfiguration);

router.get('/getLabControllerDetails', controller.getLabControllerDetails);

router.post('/updateMigrationData', controller.updateMigrationData);

router.post('/startMigration', controller.startMigration);

router.post('/setLabControllerDetails', controller.setLabControllerDetails);

router.get('/fetchFromController', controller.fetchFromController);

module.exports = router;
