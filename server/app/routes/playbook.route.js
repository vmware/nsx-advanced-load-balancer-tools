const controller = require('../controllers/playbook.controller');
const express = require('express');
const router = express.Router();

router.post('/generatePlaybook', controller.generatePlaybook);
router.get('/getPlaybooks', controller.getPlaybooks);

module.exports = router;
