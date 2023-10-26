const asyncHandler = require("express-async-handler");
const mockData = require("../../data/mock/f5destination.json");
const {
    AviLabDetailsModel, 
    AviDestinationDetailsModel,
} = require('../models/migration.model');

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

exports.getAviLabDetails = asyncHandler(async (req, res, next) => {
    try {
        const labDetails = await AviLabDetailsModel.find({});
        console.log(labDetails);

        res.status(200).json(labDetails);
    } catch (err) {
        res.status(500).json({ message: 'Error in fetching the Avi Lab controller details, '+err.message});
    }
     
});

exports.getAviDestinationDetails = asyncHandler(async (req, res, next) => {
    try {
        const destinationDetails = await AviDestinationDetailsModel.find({});
        console.log(destinationDetails);

        res.status(200).json(destinationDetails);
    } catch (err) {
        res.status(500).json({ message: 'Error in fetching the Avi Destination controller & Mappings details, '+err.message});  
    }
});
