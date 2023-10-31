const asyncHandler = require('express-async-handler');
const { spawn } = require('child_process');
const fs = require('fs-extra');
const { AviOutputModel } = require('../models/migration.model');
const { PlaybookDetailsModel } = require('../models/playbook.model');


// Constants used in the APIs.
const f5_host_ip = '10.206.40.100';

exports.generatePlaybook = asyncHandler(async (req, res, next) => {
    const { playbookName } = req.body;

    // Read the updated JSON data from DB and write same into a new file.
    if (playbookName) {
        const playbookBasePath = `./migration/${f5_host_ip}/playbook`;
        const newAviOutputFilePath = `${playbookBasePath}/${playbookName}.json`; 

        try {
            const aviOutputJson = await AviOutputModel.find({});
    
            fs.outputFileSync(newAviOutputFilePath, JSON.stringify(aviOutputJson));

            if (fs.pathExistsSync(newAviOutputFilePath)) {
                const pythonProcess = spawn('avi_config_to_ansible.py', [
                    '-c', newAviOutputFilePath, 
                    '-o', playbookBasePath,
                    // '-n', playbookName,
                ]);
    
                pythonProcess.stderr.on('data', (data) => {
                    console.error(`stderr: ${data}`);
                });
    
                // On close event, we are sure that stream from child process is closed.
                pythonProcess.on('close', async (code) => {
                    console.log(`child process close all stdio with code ${code}`);

                    const ymlFilePath = `${playbookBasePath}/avi_config.yml`; // Remove this line and enable below line
                    // const ymlFilePath = `${playbookBasePath}/${playbookName}.yml`;

                    if (fs.pathExistsSync(ymlFilePath)) {
                        console.log('yml file created successfully');

                        const playbookDetail = {
                            'playbook_name': playbookName || 'avi_config.yml',
                            'playbook_creation_time': fs.statSync(ymlFilePath).birthtime,
                        }

                        try {
                            await PlaybookDetailsModel.insertMany(playbookDetail);
                            res.status(200).json({ message: 'Playbook is created successfully.'});
                        } catch (err) {
                            console.log(err.message);
                            res.status(404).json({ message: 'Error in saving the generated Playbook in DB. ' + err.message});
                        }
                    } else {
                        res.status(404).json({ error: 'Error in generating the Playbook.'});
                    }
                });
            } else {
                res.status(404).json({ error: 'File does not exists at desired location.'});
            };

        } catch (err) {
            res.status(500).json({ error: 'Error in reading the updated Avi Output JSON, ' + err.message});
        }
    } else {
        res.status(400).json({ error: 'Missing required Playbook name.' });
    }
});
