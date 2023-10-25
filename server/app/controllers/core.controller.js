const asyncHandler = require("express-async-handler");
const mockData = require("../../data/mock/f5destination.json");

exports.getAviDestinationMappings = asyncHandler(async (req, res, next) => {
    // TODO: Parse the destination mappings in required format once it is available.
    const {
        avi_destination_ip,
        avi_destination_user,
        avi_destination_password,
        avi_destination_version
    } = req.body;

    if (
        !avi_destination_ip ||
        !avi_destination_user ||
        !avi_destination_password ||
        !avi_destination_version
    ) {
        res.status(400).json({ error: 'Missing required fields.' });
    } else {
        res.status(200).json(mockData);
    }
});
