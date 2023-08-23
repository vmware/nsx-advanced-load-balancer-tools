const controller = require('../controllers/tools.controller');
const express = require("express");
const router = express.Router();

router.get('/getData', controller.getToolsDataUsingMongoose);

router.delete('/clearData', controller.clearCollection);

router.post('/storeData', controller.storeData);

module.exports = router;