const asyncHandler = require("express-async-handler");
const destinationScriptResponse = require("../../data/mock/f5-destination-script-response.json");
const { AviDestinationMappingModel } = require("../models/core/destination.model")

const {
    AviLabDetailsModel, 
    AviDestinationDetailsModel,
} = require('../models/migration.model');

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

            for(const tenant of tenants ) {
                const formattedTenantObj = {
                    tenant: '',
                    clouds: []
                };
                if (tenant) {
                    formattedTenantObj.tenant = tenant;
                    for(const cloud of clouds) {
                        const {vrf, seg, cloud_name} = cloud;
                        if( cloud_name && (Array.isArray(vrf) || Array.isArray(seg))) {
                            const currentTenantVrf = vrf.filter(item => item.tenant === tenant);
                            const currentTenantSeg = seg.filter(item => item.tenant === tenant);

                            if(currentTenantVrf.length) {
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

                            if(currentTenantSeg.length) {
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
        res.status(500).json({ error: `Unexpected error occurred, ${err.message}`});
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
