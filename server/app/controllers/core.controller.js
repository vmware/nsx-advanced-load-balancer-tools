const asyncHandler = require("express-async-handler");
const destinationScriptResponse = require("../../data/mock/f5-destination-script-response.json");

const { F5DetailsModel } = require('../models/core/f5.model');
const { AviLabDetailsModel } = require('../models/core/lab.model');
const {
    AviDestinationMappingModel,
    AviDestinationDetailsModel
} = require("../models/core/destination.model")

const F5_HOST_IP = '10.206.40.100';

exports.getAviDestinationMappings = asyncHandler(async (req, res, next) => {
    try {
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
            // TODO: Run python script here.
            const { tenants, clouds } = destinationScriptResponse;

            const destinationMappings = {
                'tenants': []
            };

            for (const tenant of tenants) {
                const formattedTenantObj = {
                    tenant: '',
                    clouds: []
                };
                if (tenant) {
                    formattedTenantObj.tenant = tenant;
                    for (const cloud of clouds) {
                        const { vrf, seg, cloud_name } = cloud;
                        if (cloud_name && (Array.isArray(vrf) || Array.isArray(seg))) {
                            const currentTenantVrf = vrf.filter(item => item.tenant === tenant);
                            const currentTenantSeg = seg.filter(item => item.tenant === tenant);

                            if (currentTenantVrf.length) {
                                const cloudToUpdate = formattedTenantObj.clouds.find(cloud => cloud.cloud_name === cloud_name);
                                if (cloudToUpdate) {
                                    cloudToUpdate.vrf = currentTenantVrf.map(item => {
                                        return { 'name': item.name }
                                    });
                                } else {
                                    formattedTenantObj.clouds.push({
                                        'cloud_name': cloud_name,
                                        vrf: currentTenantVrf.map(item => {
                                            return { 'name': item.name }
                                        })
                                    })
                                }
                            }

                            if (currentTenantSeg.length) {
                                const cloudToUpdate = formattedTenantObj.clouds.find(cloud => cloud.cloud_name === cloud_name);
                                if (cloudToUpdate) {
                                    cloudToUpdate.seg = currentTenantSeg.map(item => {
                                        return { 'name': item.name }
                                    });
                                } else {
                                    formattedTenantObj.clouds.push({
                                        'cloud_name': cloud_name,
                                        seg: currentTenantSeg.map(item => {
                                            return { 'name': item.name }
                                        })
                                    })
                                }
                            }
                        }
                    }
                }
                destinationMappings.tenants.push(formattedTenantObj);
            }

            await AviDestinationMappingModel.insertMany({
                avi_destination_ip,
                tenants: destinationMappings.tenants
            });
            res.status(200).json(destinationMappings);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: `Unexpected error occurred, ${err.message}` });
    }
});

exports.saveAviLabDetails = asyncHandler(async (req, res, next) => {
    try {
        const {
            avi_lab_ip,
            avi_lab_user,
            avi_lab_password,
        } = req.body;

        const findQuery = { 'f5_host_ip': `${F5_HOST_IP}` };

        await AviLabDetailsModel.findOneAndUpdate(findQuery, { 'data': {
            avi_lab_ip,
            avi_lab_user,
            avi_lab_password,
        }}, {
            upsert: true
        });

        res.status(200).json({ message: 'Avi Lab details are saved successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Error in saving Avi Lab controller details, ' + err.message });
    }
});

exports.getAviLabDetails = asyncHandler(async (req, res, next) => {
    try {
        const labDetails = await this.fetchAviLabDetails();

        if (labDetails) {
            res.status(200).json(labDetails);
        } else {
            res.status(404).json({ error: "Lab controller details not found." });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error in fetching the Avi Lab controller details, ' + err.message });
    }
});


exports.getAviDestinationDetails = asyncHandler(async (req, res, next) => {
    try {
        const destinationDetails = await this.fetchAviDestinationDetails();

        if (destinationDetails) {
            res.status(200).json(destinationDetails);
        } else {
            res.status(404).json({ error: "Avi Destination details not found." });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error in fetching the Avi Destination controller & Mappings details, ' + err.message });
    }
});

exports.getF5Details = asyncHandler(async (req, res, next) => {
    try {
        const f5Details = await this.fetchF5Details();

        if (f5Details) {
            res.status(200).json(f5Details);
        } else {
            res.status(404).json({ error: "F5 details not found." });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error in fetching the F5 details, ' + err.message });
    }
});

/*************************************************************************** Utility Functions *************************************************************/

exports.fetchAviLabDetails = async function () {
    const findQuery = { 'f5_host_ip': `${F5_HOST_IP}` };
    const foundDoc = await AviLabDetailsModel.findOne(findQuery).lean();

    if (foundDoc) {
        const labDetails = foundDoc.data;

        return labDetails;
    }
}

exports.fetchAviDestinationDetails = async function () {
    const findQuery = { 'f5_host_ip': `${F5_HOST_IP}` };
    const foundDoc = await AviDestinationDetailsModel.findOne(findQuery).lean();

    if (foundDoc) {
        const destinationDetails = foundDoc.data;

        return destinationDetails;
    }
}

exports.fetchF5Details = async function () {
    const findQuery = { 'f5_host_ip': `${F5_HOST_IP}` };
    const foundDoc = await F5DetailsModel.findOne(findQuery).lean();

    if (foundDoc) {
        const f5Details = foundDoc.data;

        return f5Details;
    }
}
