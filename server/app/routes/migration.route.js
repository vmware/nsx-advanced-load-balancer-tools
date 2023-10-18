const controller = require('../controllers/migration.controller');
const express = require("express");
const router = express.Router();

router.post('/generateConfiguration', controller.generateConfiguration);

/********************************************************************/
//  Below is the list of APIs previously being added with mock data 
/********************************************************************/

router.get('/getLabControllerDetails', controller.getLabControllerDetails);

router.post('/updateMigrationData', controller.updateMigrationData);

router.post('/startMigration', controller.startMigration);

router.post('/setLabControllerDetails', controller.setLabControllerDetails);

router.get('/fetchFromController', controller.fetchFromController);

module.exports = router;
