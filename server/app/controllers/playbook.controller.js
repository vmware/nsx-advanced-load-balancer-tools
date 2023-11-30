const asyncHandler = require('express-async-handler');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs-extra');
const { AviOutputModel } = require('../models/migration.model');
const { PlaybookDetailsModel } = require('../models/playbook.model');
const coreController = require('./core.controller');


// Constants used in the APIs.
const F5_HOST_IP = '10.206.40.100';
const DEFAULT_PLAYBOOK_NAME = 'avi_config';

const savePlaybooksInDB = async (playbookName, fileCreationTime, res) => {
    try{
        const findQuery = { 'f5_host_ip': `${F5_HOST_IP}` };
        const foundDoc = await PlaybookDetailsModel.findOne(findQuery).lean();

        const docPlaybooks = foundDoc ? foundDoc['playbooks'] : [];

        docPlaybooks.push({
            'playbook_name': `${playbookName}.yml`, // Need to remove this commented code
            'playbook_creation_time': fileCreationTime,
        });
        docPlaybooks.push({
            'playbook_name': `${playbookName}_delete.yml`, // Need to remove this commented code
            'playbook_creation_time': fileCreationTime,
        });

        await PlaybookDetailsModel.findOneAndUpdate(findQuery, { 'playbooks': docPlaybooks }, {
            upsert: true
        });

        res.status(200).json({ message: 'Playbooks are saved successfully.'});
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: 'Error in saving Playbooks' + err.message});
    }
};

exports.generatePlaybook = asyncHandler(async (req, res, next) => {
    const { playbookName = DEFAULT_PLAYBOOK_NAME, f5_host_ip = F5_HOST_IP } = req.body;

    if (playbookName) {
        // Read the updated JSON data from DB and write same into a new file.
        const playbookBasePath = `./migration/${f5_host_ip}/playbook`;
        const newAviOutputFilePath = `${playbookBasePath}/${playbookName}.json`;

        try {
            const aviOutputJson = await AviOutputModel.find({});

            fs.outputFileSync(newAviOutputFilePath, JSON.stringify(aviOutputJson, null, 4));

            if (fs.pathExistsSync(newAviOutputFilePath)) {
                let errorMessage;
                const pythonProcess = spawn('avi_config_to_ansible.py', [
                    '-c', newAviOutputFilePath,
                    '-o', playbookBasePath,
                    '-n', playbookName,
                ]);

                pythonProcess.stderr.on('data', (data) => {
                    errorMessage = data.toString();

                    console.error('Error while executing avi_config_to_ansible.py script. ', data.toString());
                });

                // On close event, we are sure that stream from child process is closed.
                pythonProcess.on('close', async (code) => {
                    console.log(`child process close all stdio with code ${code}`);

                    if (code === 0) {
                        // Remove these lines and enable below commented lines
                        const playbookFilePath = `${playbookBasePath}/${playbookName}.yml`;
                        const deletePlaybookFilePath = `${playbookBasePath}/${playbookName}_delete.yml`;

                        if (fs.pathExistsSync(playbookFilePath) && fs.pathExistsSync(deletePlaybookFilePath)) {
                            console.log('Playbooks are created successfully by script.');

                            const fileCreationTime = fs.statSync(playbookFilePath).birthtime;

                            savePlaybooksInDB(playbookName, fileCreationTime, res);
                        } else {
                            res.status(500).json({ message: 'Error in generating Playbooks.'});
                        }
                    } else {
                        res.status(500).json({ message: 'Error in generating Playbooks.'});
                    }
                });
            } else {
                res.status(500).json({ message: errorMessage || 'Error in generating Playbooks.'});
            };

        } catch (err) {
            res.status(500).json({ message: 'Error in reading the updated Configurations, ' + err.message});
        }
    } else {
        res.status(400).json({ message: 'Missing required Playbook name.' });
    }
});

exports.downloadPlaybook = asyncHandler(async (req, res, next) => {
    try {
        const f5Details = await coreController.fetchF5Details();

        if (f5Details) {
            const { f5_host_ip = F5_HOST_IP } = f5Details;
            const playbookRelativePath = `../../migration/${f5_host_ip}/playbook`;
            const filePath = path.join(__dirname, playbookRelativePath, req.query.fileName)

            res.download(filePath, (err) => {
                if (err) {
                    if (!res.headersSent) {
                        return res.status(404).json({ message: 'Error while downloading playbook. ' + err.message });
                    }
                }
            });
        } else {
            res.status(500).json({ message: 'Error F5 details not found. '});
        }
    } catch (err) {
        res.status(500).json({ message: 'Error while fetching F5 details. ' + err.message });
    }
});

exports.getPlaybooks = asyncHandler(async (req, res, next) => {
    try{
        const findQuery = { 'f5_host_ip': `${F5_HOST_IP}` };
        const foundDoc = await PlaybookDetailsModel.findOne(findQuery).lean();

        const docPlaybooks = foundDoc ? foundDoc['playbooks'] : [];

        console.log(docPlaybooks);
        res.status(200).json({ 'result': docPlaybooks });
    } catch (err) {
        res.status(500).json({ message: 'Error in getting Playbooks. ' + err.message});
    }
});
