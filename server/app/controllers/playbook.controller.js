const asyncHandler = require('express-async-handler');
const { spawn } = require('child_process');
const fs = require('fs-extra');
const { AviOutputModel } = require('../models/migration.model');
const { PlaybookDetailsModel } = require('../models/playbook.model');


// Constants used in the APIs.
const F5_HOST_IP = '10.206.40.100';
const DEFAULT_PLAYBOOK_NAME = 'avi_config';

const savePlaybooksInDB = async (playbookName, fileCreationTime, f5_host_ip, res) => {
    try{
        const findQuery = { 'f5_host_ip': `${f5_host_ip}` };
        const foundDoc = await PlaybookDetailsModel.findOne(findQuery).lean();
        
        const docPlaybooks = foundDoc ? foundDoc['playbooks'] : [];

        docPlaybooks.push({
            'playbook_name': `${playbookName}.yml`,
            'playbook_creation_time': fileCreationTime,
        });
        docPlaybooks.push({
            'playbook_name': `${playbookName}_delete.yml`,
            'playbook_creation_time': fileCreationTime,
        });

        await PlaybookDetailsModel.findOneAndUpdate(findQuery, { 'playbooks': docPlaybooks }, {
            upsert: true
        });

        res.status(200).json({ message: 'Playbooks are saved successfully.'});
    } catch (err) {
        console.log(err.message);
        res.status(404).json({ message: 'Error in saving the generated Playbooks in DB. ' + err.message});
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

                    // Remove these lines and enable below commented lines
                    const playbookFilePath = `${playbookBasePath}/avi_config.yml`; 
                    const deletePlaybookFilePath = `${playbookBasePath}/avi_config_delete.yml`;
                    // const playbookFilePath = `${playbookBasePath}/${playbookName}.yml`;
                    // const deletePlaybookFilePath = `${playbookBasePath}/${playbookName}_delete.yml`;

                    if (fs.pathExistsSync(playbookFilePath) && fs.pathExistsSync(deletePlaybookFilePath)) {
                        console.log('Playbooks are created successfully by script.');

                        const fileCreationTime = fs.statSync(playbookFilePath).birthtime;

                        savePlaybooksInDB(playbookName, fileCreationTime, f5_host_ip, res);
                    } else {
                        res.status(404).json({ error: 'Error in generating Playbooks.'});
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
