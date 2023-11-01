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

exports.fetchAviLabDetails = async function () {
    try {
        const findQuery = { 'f5_host_ip': `${F5_HOST_IP}` };
        const foundDoc = await AviLabDetailsModel.findOne(findQuery).lean();

        if (foundDoc) {
            const labDetails = foundDoc.data;
            console.log(labDetails);

            return labDetails;
        }
    } catch (err) {
        res.status(500).json({ message: 'Error in fetching the Avi Lab controller details, ' + err.message });
    }
}

exports.getAviLabDetails = async (req, res, next) => {
    const labDetails = await fetchAviLabDetails();

    if (labDetails) {
        res.status(200).json(labDetails);
    } else {
        res.status(404).json({ error: "Lab details not found." });
    }
};

exports.getAviDestinationDetails = asyncHandler(async (req, res, next) => {
    try {
        const findQuery = { 'f5_host_ip': `${F5_HOST_IP}` };
        const foundDoc = await AviDestinationDetailsModel.findOne(findQuery).lean();

        if (foundDoc) {
            const destinationDetails = foundDoc.data;
            console.log(destinationDetails);

            res.status(200).json(destinationDetails);
        } else {
            res.status(404).json({ error: "Avi Destination details not found." });
        }

    } catch (err) {
        res.status(500).json({ message: 'Error in fetching the Avi Destination controller & Mappings details, ' + err.message });
    }
});

exports.fetchF5Details = async function () {
    try {
        const findQuery = { 'f5_host_ip': `${F5_HOST_IP}` };
        const foundDoc = await F5DetailsModel.findOne(findQuery).lean();

        if (foundDoc) {
            const f5Details = foundDoc.data;
            console.log(f5Details);

            return f5Details;
        }
    } catch (err) {
        res.status(500).json({ message: 'Error in fetching the Avi Lab controller details, ' + err.message });
    }
}

exports.getF5Details = asyncHandler(async (req, res, next) => {
        const f5Details = await fetchF5Details();

        if (f5Details) {
            res.status(200).json(f5Details);
        } else {
            res.status(404).json({ error: "F5 details not found." });
        }
});
