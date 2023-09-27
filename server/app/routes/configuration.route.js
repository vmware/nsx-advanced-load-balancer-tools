const controller = require('../controllers/configuration.controller');
const express = require("express");
const router = express.Router();

router.get('/getAllIncompleteVSMigrationData', controller.getAllIncompleteVSMigrationData);

module.exports = router;
