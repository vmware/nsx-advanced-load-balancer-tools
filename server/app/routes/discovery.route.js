const controller = require('../controllers/discovery.controller');
const express = require('express');
const router = express.Router();

router.post('/generateReport', controller.generateReport);
router.get('/getReport', controller.getReport);
router.get('/downloadReport', controller.downloadReport);

module.exports = router;
