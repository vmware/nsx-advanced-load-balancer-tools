const asyncHandler = require("express-async-handler");
const data = require("./../../data/mock/configuration.data");

exports.getAllIncompleteVSMigrationData = asyncHandler(async (req, res, next) => {
    const result = data.getAllIncompleteVSMigrationData;

    res.status(200).json(result);
});


exports.getLabControllerDetails = asyncHandler(async (req, res, next) => {
    const result = data.labControllerDetails;

    res.status(200).json(result);
});

exports.updateMigrationData = asyncHandler(async (req, res, next) => {
    const result = req.body

    res.status(200).json(result);
});

exports.startMigration = asyncHandler(async (req, res, next) => {
    const result = data.getAllIncompleteVSMigrationData;

    res.status(200).json(result);
});
