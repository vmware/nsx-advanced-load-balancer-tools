const { spawn } = require('child_process');
const fs = require("fs")
const asyncHandler = require('express-async-handler');
const ReportSheet = require('../models/discovery.model');
const controllerVersion = '30.2.1';

// Run f5_converter, generate output, save in DB.
exports.generateReport = asyncHandler(async (req, res, next) => {
    const { f5_host_ip, f5_ssh_user, f5_ssh_password } = req.body;
    const outputFilePath = `./migration/${f5_host_ip}/output/bigip-conversionstatus.json`; // bigip_discovery_data.json`;
    let dataToSend;

    // TO DO: Need to take care of Refresh, as we will not re-run script if we already have data in DB

    // Spawn new child process to call the python script. // , '--discovery'
    const pythonProcess = spawn('f5_converter.py', ['--f5_host_ip', f5_host_ip, '--f5_ssh_user', f5_ssh_user, '--f5_ssh_password', f5_ssh_password, '--vrf', 'global', '--tenant', 'admin', '--controller_version', controllerVersion, '--cloud_name', 'Default-Cloud', '-o', 'migration']);

    // Collect data from script.
    pythonProcess.stdout.on('data', function (data) {
        console.log('Pipe data from python script ...');
        dataToSend = data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    // On close event, we are sure that stream from child process is closed.
    pythonProcess.on('close', (code) => {
        console.log(dataToSend);
        console.log(`child process close all stdio with code ${code}`);
        const exists = fs.existsSync(outputFilePath);

        if (exists) {
            fs.readFile(outputFilePath, async function(err, data) { 
                if (data) {
                    const outputJson = JSON.parse(data);
                    
                    // Save the data into MongoDB 
                    try {
                        const saveResult = await ReportSheet.insertMany(outputJson);    
                        console.log(saveResult);

                        res.status(200).json({ message: 'Report generated successfully.'});
                    } catch (err) {
                        res.status(200).json({ message: 'Error in saving output in DB, '+err.message});
                    }
                } 
            });
        } else {
            res.status(200).json({ message: 'Error in report generation'});
        }
    });
});

// Get the discovery report from DB.
exports.getReport = asyncHandler(async (req, res, next) => {
    // Fetch the data from MongoDB
    const fetchResult = await ReportSheet.find({});

    console.log(fetchResult);
    res.status(200).json(reportJson);
});

const reportJson = {
    "downloadLink": "https://www.google.com",
    "pools": {
        "total": 125,
        "enabledCount": 10,
        "deactivatedCount": 5
    },
    "iRules": {
        "total": 123,
        "conversionRate": 85
    },
    "tenants": {
        "total": 22
    },
    "traffic": {
        "request": 123,
        "bytes": 123,
        "maxConnections": 12300
    },
    "unsupported": {
        "total": 20
    },
    "virtualService": {
        "total": 116,
        "types": {
            "L4": 0,
            "L7": 95,
            "DNS": 0,
            "UDP": 0,
            "SSL": 0,
            "WAF": 0
        },
        "enabledCount": 116,
        "deactivatedCount": 0
    }
};
