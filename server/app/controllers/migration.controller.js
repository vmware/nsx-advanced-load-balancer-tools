const asyncHandler = require("express-async-handler");
const { spawn } = require('child_process');
const fs = require("fs");
const data = require("../../data/mock/configuration.data");

const { F5DetailsModel } = require('../models/core/f5.model');
const { AviLabDetailsModel } = require('../models/core/lab.model');
const { AviDestinationDetailsModel } = require('../models/core/destination.model');
const {
    ConversionStatusModel,
    AviOutputModel,
} = require('../models/migration.model');
const coreController = require('./core.controller');

// Constants used in the file.
const MIGRATION_FOLDER_NAME = 'migration';
const F5_HOST_IP = '10.206.40.100';
const SINGLE_OBJECT_TYPE = 'singleObject';
const VS_OBJECT_TYPE = 'virtualService';
const SUCCESSFUL_STATUS = 'SUCCESSFUL';
const PARTIAL_STATUS = 'PARTIAL';


/**
 *  Run the migration tool with Certs & Keys from F5 and with fetched configuration from Lab Controller.
 *  Save the JSON(s) produced by migration tool into DB.
 */
const runMigrationAndSaveJson = (f5Details, labDetails, destinationDetails, res) => {
    const { f5_host_ip } = f5Details;
    const conversionStatusFilePath = `./${MIGRATION_FOLDER_NAME}/${f5_host_ip}/output/bigip-conversionstatus.json`;
    const aviOutputFilePath = `./${MIGRATION_FOLDER_NAME}/${f5_host_ip}/output/bigip-output.json`;

    let dataToSend;
    const pythonProcess = spawn('f5_converter.py', [
        '--f5_host_ip', f5_host_ip,
        '--f5_ssh_user', f5Details.f5_ssh_user,
        '--f5_ssh_password', f5Details.f5_ssh_password,
        '-c', labDetails.avi_lab_ip,
        '-u', labDetails.avi_lab_user,
        '-p', labDetails.avi_lab_password,
        '--vrf', destinationDetails.avi_mapped_vrf,
        '--tenant', destinationDetails.avi_mapped_tenant,
        '--cloud_name', destinationDetails.avi_mapped_cloud,
        '--controller_version', destinationDetails.avi_destination_version,
        '-o', MIGRATION_FOLDER_NAME
    ], {
        shell: true,
    });

    // Collect data from script.
    pythonProcess.stdout.on('data', function (data) {
        console.log('Pipe data from python script ...');
        dataToSend = data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        console.log('1' + data.toString());
        res.status(500).json({ message: data.toString() });
    });

    // On close event, we are sure that stream from child process is closed.
    pythonProcess.on('close', (code) => {
        console.log(dataToSend);
        console.log(`child process close all stdio with code ${code}`);

        if (code !== 1) {
            // Save the generated JSONs into DB.
            if (fs.existsSync(conversionStatusFilePath) && fs.existsSync(aviOutputFilePath)) {
                const readFromFile = (filePath) => {
                    return new Promise((resolve, reject) => {
                        fs.readFile(filePath, (err, data) => {
                            if (err) {
                                console.log(err);
                                reject(err);
                            } else {
                                resolve(JSON.parse(data));
                            }
                        })
                    });
                };

                const generatedFilePromises = [
                    readFromFile(conversionStatusFilePath, 'ConversionStatus'),
                    readFromFile(aviOutputFilePath, 'AviOutput'),
                ];

                Promise.all(generatedFilePromises).then(async (jsonData) => {
                    try {
                        await ConversionStatusModel.findOneAndUpdate({}, jsonData[0], { upsert: true });
                        await AviOutputModel.findOneAndUpdate({}, jsonData[1], { upsert: true });

                        res.status(200).json({ message: 'Configurations generated successfully.' });
                    } catch (err) {
                        res.status(500).json({ message: `Error in saving the configurations into DB, `+err.message});
                    }
                }).catch((err) => {
                    res.status(500).json({ message: `Error in reading the configurations, `+err.message});
                });
            }
        } else {
            res.status(500).json({ message: 'Error in generating the configurations.' });
        }
    });
};

// Generate the configuraitons using migration tool.
exports.generateConfiguration = asyncHandler(async (req, res, next) => {
    const {
        f5_host_ip = F5_HOST_IP,
        f5_ssh_user,
        f5_ssh_password,
        avi_lab_ip = '10.10.10.10',
        avi_lab_user = 'admin',
        avi_lab_password = 'admin',
        avi_destination_ip = '10.10.10.10',
        avi_destination_user = 'admin',
        avi_destination_password = 'admin',
        avi_destination_version = '30.2.1',
        avi_mapped_vrf = 'global',
        avi_mapped_tenant = 'admin',
        avi_mapped_cloud = 'Default-Cloud',
        avi_mapped_segroup = 'Default-Group',
    } = req.body;


    const f5Details = {
        f5_host_ip,
        f5_ssh_user,
        f5_ssh_password,
    }

    const labDetails = {
        avi_lab_ip,
        avi_lab_user,
        avi_lab_password,
    }

    const destinationDetails = {
        avi_destination_ip,
        avi_destination_user,
        avi_destination_password,
        avi_destination_version,
        avi_mapped_vrf,
        avi_mapped_tenant,
        avi_mapped_cloud,
        avi_mapped_segroup,
    }

    // Save the User provided details in DB.
    try {
        // Save the F5 Controller details.
        const findQuery = { 'f5_host_ip': `${F5_HOST_IP}` };

        await F5DetailsModel.findOneAndUpdate(findQuery, { data: f5Details }, { upsert: true });

        // Save the Avi Lab details.
        await AviLabDetailsModel.findOneAndUpdate(findQuery, { data: labDetails }, { upsert: true });

        // Save the Avi Desintion details & Mappings details.
        await AviDestinationDetailsModel.findOneAndUpdate(findQuery, { data: destinationDetails }, { upsert: true });
    } catch (err) {
        res.status(500).json({ message: 'Error in saving the F5/Lab/Destination details(mappings), ' + err.message });
    }

    runMigrationAndSaveJson(f5Details, labDetails, destinationDetails, res);
});


exports.getConfiguration = asyncHandler(async (req, res, next) => {
    try {
        const [conversionStatusResult] = await ConversionStatusModel.aggregate([
            {
                $project: {
                    _id: 0,  // Exclude the _id field if you don't need it
                    data: "$status_sheet"
                }
            }
        ]);
        const [aviOutputResult] = await AviOutputModel.find({}, { _id: 0 }).lean();
        let vsIncompleteMigrationData = [];
        let completedVSMigrationsCount = 0;

        if (conversionStatusResult?.data?.virtual && aviOutputResult) {
            const { data } = conversionStatusResult;

            vsIncompleteMigrationData = getIncompleteMigrationData(data, aviOutputResult) || [];
            completedVSMigrationsCount = data.virtual.length - vsIncompleteMigrationData.length;
        }

        return res.status(200).json({
            incompleteVSMigrationsData: vsIncompleteMigrationData,
            completedVSMigrationsCount: completedVSMigrationsCount,
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Error while fetching the configuration details, ' + err.message });
    }
});

function getIncompleteMigrationData(data, aviOutputResult) {
    const vsIncompleteMigrationData = data.virtual.filter(virtual => {
        // Filter out partial status Vs_Mappings objects.
        virtual.flaggedObjects = virtual.Vs_Mappings.filter(mapping => mapping.Status !== SUCCESSFUL_STATUS);

        virtual.flaggedObjects.forEach(object => {
            const objectF5TypeConfig = data[object.F5_type];
            const objectF5SubTypeConfig = object.F5_SubType ? objectF5TypeConfig[object.F5_SubType] : objectF5TypeConfig;

            object.F5_Object = getF5Config(objectF5SubTypeConfig, object.F5_ID) || '';

            object.avi_objects.forEach(object => {
                const aviTypeConfig = aviOutputResult[object.avi_type] || [];

                object.Avi_Object = getAviConfig(aviTypeConfig, object.avi_name);
            });
        });

        // Filter only incomplete migration data by checking status of Vs and Vs_Mappings objects.
        return virtual.flaggedObjects.length || virtual.Status !== SUCCESSFUL_STATUS;
    });

    return vsIncompleteMigrationData;
}

function getF5Config(config, id) {
    if (Array.isArray(config)) {
        return config.find(element => element.F5_ID === id)?.F5_Object;
    }
}

function getAviConfig(config, name) {
    if (Array.isArray(config)) {
        return config.find(element => element.name === name);
    }
}

exports.fetchConfiguration = asyncHandler(async (req, res, next) => {
    try {
        const f5Details = await coreController.fetchF5Details();
        const labDetails = await coreController.fetchAviLabDetails();
        const destinationDetails = await coreController.fetchAviDestinationDetails();

        if (f5Details && labDetails && destinationDetails) {
            runMigrationAndSaveJson(f5Details, labDetails, destinationDetails, res);
        }
        else {
            return res.status(500).json({ message: 'Required data for script not found.' });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Error in fetching the F5/Lab/destination details, ' + err.message });
    }
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

exports.fetchFromController = asyncHandler(async (req, res, next) => {
    const result = data.getAllIncompleteVSMigrationData;

    res.status(200).json(result);
});

exports.setLabControllerDetails = asyncHandler(async (req, res, next) => {
    data.labControllerDetails = req.body;
    const result = data.labControllerDetails;

    res.status(200).json(result);
});

/**
 * Replace "Avi_Object" in AviOutputModel for given avi_name and avi_type.
 */
const updateAviObjectInAviOutputModel = async (req, res) => {
    try {
        const { Vs_Mapping: { avi_objects: aviObjects } } = req.body;
        const [{ Avi_Object: aviObjectToUpdate }] = aviObjects;
        const [{ avi_type: profileType, avi_name: profileName }] = aviObjects;

        const profileTypeString = `${profileType}.name`
        const findQuery = { [profileTypeString]: `${profileName}` }
        const doc = await AviOutputModel.findOne(findQuery);
        const profile = doc[profileType]
        if (profile) {
            const indexToUpdate = profile.findIndex(profileItem => profileItem.name === profileName);
            const updateQuery = `${profileType}.${indexToUpdate}`;
            await AviOutputModel.findOneAndUpdate(findQuery, { $set: { [updateQuery]: aviObjectToUpdate } });
        } else {
            res.status(500).json({ error: "Profile you are trying to update does not exists." });
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message });
    }
};

/**
 * Replace Status with updated status coming from UI, at two places -
 * one at VS_mappings of an individual virtualservice(virtual) under ConversionStatusModel and
 * second place at profile/pool or anyother entity type and subtype status key.
 */
const updateStatus = async (req, res) => {
    try {
        const { F5_type: parentF5Type, F5_SubType: parentF5SubType = '', F5_ID: parentF5Id } = req.body;
        const { Vs_Mapping: { Status: mappingStatus, F5_type: childF5Type, F5_SubType: childF5SubType = '', F5_ID: childF5Id } } = req.body;

        const profileTypeString = parentF5SubType.trim() ? `status_sheet.${parentF5Type}.${parentF5SubType}.F5_ID` : `status_sheet.${parentF5Type}.F5_ID`;
        const findQuery = { [profileTypeString]: `${parentF5Id}` };
        const doc = await ConversionStatusModel.findOne(findQuery).lean();
        const parentEntity = parentF5SubType.trim() ? doc['status_sheet'][parentF5Type][parentF5SubType] : doc['status_sheet'][parentF5Type];

        if (parentEntity) {
            const parentIndexToUpdate = parentEntity.findIndex(item => item.F5_ID === parentF5Id);
            const childIndexToUpdate = parentEntity[parentIndexToUpdate]['Vs_Mappings'].findIndex(item => item.F5_ID === childF5Id);
            const subProfileIndexToUpdate = doc['status_sheet'][childF5Type][childF5SubType].findIndex(item => item.F5_ID === childF5Id);

            const VsMappingUpdateQuery = parentF5SubType.trim() ?
                `status_sheet.${parentF5Type}.${parentF5SubType}.${parentIndexToUpdate}.Vs_Mappings.Status` :
                `status_sheet.${parentF5Type}.${parentIndexToUpdate}.Vs_Mappings.${childIndexToUpdate}.Status`;
            const profileTypeUpdateQuery = `status_sheet.${childF5Type}.${childF5SubType}.${subProfileIndexToUpdate}.Status`;

            // Add new key 'isManuallyReviewed' to the conversion collection, to track the manual reviewed status.
            // Only Virtual to have this key.
            const entityReviewedUpdateQuery = `status_sheet.virtual.${parentIndexToUpdate}.isManuallyReviewed`;
            if (parentF5Type === 'virtual') {
                const update = await ConversionStatusModel.findOneAndUpdate(findQuery, { $set:{
                    [VsMappingUpdateQuery]: mappingStatus,
                    [profileTypeUpdateQuery]: mappingStatus,
                    [entityReviewedUpdateQuery]: true
                }});
            } else {
                const update = await ConversionStatusModel.findOneAndUpdate(findQuery, { $set:{
                    [VsMappingUpdateQuery]: mappingStatus,
                    [profileTypeUpdateQuery]: mappingStatus,
                }});
            }
        } else {
            res.status(500).json({ error: "Profile you are trying to update does not exists." });
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message });
    }
};

/**
 * Replace entire object based on entity type and subtype status key.
 */
const replaceEntityObject = async (req, res) => {
    try {
        const { F5_type: entityF5Type, F5_SubType: entityF5SubType = '', F5_ID: entityF5Id } = req.body;
        const updateVSPayload = req.body
        // Add new key 'isReviewed' to the conversion collection, to track the manual reviewed status.
        updateVSPayload['isReviewed'] = true;

        const profileTypeString = entityF5SubType.trim() ? `status_sheet.${entityF5Type}.${entityF5SubType}.F5_ID` : `status_sheet.${entityF5Type}.F5_ID`;
        const findQuery = { [profileTypeString]: `${entityF5Id}` };
        const doc = await ConversionStatusModel.findOne(findQuery).lean();
        const entity = entityF5SubType.trim() ? doc['status_sheet'][entityF5Type][entityF5SubType] : doc['status_sheet'][entityF5Type];

        if (entity) {
            const entityIndexToUpdate = entity.findIndex(item => item.F5_ID === entityF5Id);
            const entityUpdateQuery = entityF5SubType.trim() ?
                `status_sheet.${entityF5Type}.${entityF5SubType}.${entityIndexToUpdate}` :
                `status_sheet.${entityF5Type}.${entityIndexToUpdate}`;

            const update = await ConversionStatusModel.findOneAndUpdate(findQuery, { $set: { [entityUpdateQuery]: updateVSPayload } });
        } else {
            res.status(200).json({ message: "Profile you are trying to update does not exists." });
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message });
    }
};

exports.acceptConfiguration = asyncHandler(async (req, res, next) => {
    const { type } = req.query;

    if (type === SINGLE_OBJECT_TYPE) {
        await updateAviObjectInAviOutputModel(req, res);
        await updateStatus(req, res);

        res.status(200).json({ message: 'Successfully updated Status and Avi_Object' });
    } else if (type === VS_OBJECT_TYPE) {
        await replaceEntityObject(req, res)

        res.status(200).json({ message: 'Successfully updated the VirtualService object' });
    } else {
        res.status(400).json({ error: "Invalid parameters please send either singleObject or virtualService as type query parameters" });
    }
});

/**
 * Aggregation to get the virtual and nested Vs_Mappings having status as SUCCESSFUL.
 */
const aggregateSuccessfulMigration = async (req, res) => {
    try {
        const successfulAggregation = [
            [
                {
                    $project: {
                        "status_sheet.virtual": 1,
                    },
                },
                {
                    $unwind: {
                        path: "$status_sheet.virtual",
                    },
                },
                {
                    $match: {
                        "status_sheet.virtual.Status":
                            SUCCESSFUL_STATUS,
                        "status_sheet.virtual.Vs_Mappings.Status":
                            SUCCESSFUL_STATUS,
                    },
                },
            ]
        ]

        const matchedVirtuals = await ConversionStatusModel.aggregate(successfulAggregation);

        if (Array.isArray(matchedVirtuals) && matchedVirtuals.length) {
            const ready = [];
            // Check if every Vs_Mappings Status is SUCCESSFUL. If not consider the migration(virtuals) as incomplete.
            matchedVirtuals.map((matchedVirtual) => {
                const vsMappings = matchedVirtual.status_sheet?.virtual?.Vs_Mappings;
                const areAllVSMappingsSuccessful = vsMappings.every(item => item.Status === SUCCESSFUL_STATUS);
                matchedVirtual['areAllVSMappingsSuccessful'] = areAllVSMappingsSuccessful;
                if (areAllVSMappingsSuccessful) {
                    ready.push({
                        'F5_ID': matchedVirtual.status_sheet?.virtual?.F5_ID,
                        'isReviewed': matchedVirtual.status_sheet?.virtual?.isReviewed || false
                    });
                }

                return matchedVirtual;
            });
            const successfulVirtuals = matchedVirtuals.filter(item => item.areAllVSMappingsSuccessful);

            return { successfulVirtuals, ready };
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message });
    }
};

/**
 * Aggregation to get the virtual and nested Vs_Mappings which have status PARTIAL.
 */
const aggregateIncompleteMigration = async (req, res) => {
    try {
        const incompleteMigrationAggregation = [
            [
                {
                    $project: {
                        "status_sheet.virtual": 1,
                    },
                },
                {
                    $unwind: {
                        path: "$status_sheet.virtual",
                    },
                },
                {
                    $match: {
                        $or: [
                            {
                                "status_sheet.virtual.Vs_Mappings.Status": PARTIAL_STATUS
                            },
                            {
                                "status_sheet.virtual.Status": PARTIAL_STATUS
                            }
                        ]
                    },
                },
            ]
        ]

        const incompleteVirtuals = await ConversionStatusModel.aggregate(incompleteMigrationAggregation) || [];
        if (Array.isArray(incompleteVirtuals) && incompleteVirtuals.length) {
            return incompleteVirtuals;
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message });
    }
};

exports.getReadyVirtuals = asyncHandler(async (req, res, next) => {
    try {
        // TODO: Update query once we have a key to distinguish between multiple converstion objects.

        // Get Aggregation of the virtual and nested Vs_Mappings having status as SUCCESSFUL.
        const successfulVirtualsResponse =  await aggregateSuccessfulMigration(req, res);
        const ready = successfulVirtualsResponse?.ready;

        if (Array.isArray(ready)) {
            res.status(200).json({ result: { ready, readyCount: ready.length } });
        } else {
            res.status(200).json({ result: { ready: [], readyCount: 0 } });
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message });
    }

});

exports.getMigrationOverview = asyncHandler(async (req, res, next) => {
    try {
        // TODO: Update query once we have a key to distinguish between multiple converstion objects.

        let incompleteVirtuals;
        let successfulVirtuals;
        let migrationCompletedPercentage = 0;
        let successfulVirtualsCount = 0;
        let incompleteVirtualCount = 0;

        // Get Aggregation of the virtual and nested Vs_Mappings having status as SUCCESSFUL.
        const successfulVirtualsResponse =  await aggregateSuccessfulMigration(req, res);
        incompleteVirtuals  = await aggregateIncompleteMigration(req, res)

        successfulVirtuals = successfulVirtualsResponse?.successfulVirtuals;

        if (successfulVirtuals && incompleteVirtuals) {
            if (Array.isArray(successfulVirtuals)) {
                successfulVirtualsCount = successfulVirtuals.length
            }
            if (Array.isArray(incompleteVirtuals)) {
                incompleteVirtualCount = incompleteVirtuals.length;
            }
            if (successfulVirtualsCount && incompleteVirtualCount) {
                migrationCompletedPercentage = successfulVirtualsCount / (successfulVirtualsCount + incompleteVirtualCount) * 100;
                migrationCompletedPercentage = +migrationCompletedPercentage.toFixed(2);
            }

            res.status(200).json({
                result: {
                    reviewedVirtuals: successfulVirtualsCount,
                    incompleteVirtuals: incompleteVirtualCount,
                    migrationCompletedPercentage
                }
            });
        } else {
            res.status(200).json({
                result: {}
            });
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message });
    }
});
