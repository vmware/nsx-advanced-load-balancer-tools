const asyncHandler = require("express-async-handler");
const data = require("./../../data/mock/configuration.data");

exports.getAllIncompleteVSMigrationData = asyncHandler(async (req, res, next) => {
    const result = data.getAllIncompleteVSMigrationData;

    res.status(200).json(result);
});
