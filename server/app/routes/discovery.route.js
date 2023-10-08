const controller = require('../controllers/discovery.controller');
const express = require('express');
const router = express.Router();

router.post('/generateReport', controller.generateReport);
router.get('/getReport', controller.getReport);

module.exports = router;
