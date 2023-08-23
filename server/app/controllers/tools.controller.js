const asyncHandler = require("express-async-handler");
const Sheet = require('../models/tools.model');

//const { MongoClient } = require('mongodb');
//const { spawn } = require('child_process');
// const path = require('path');

// Display all data using MongoClient code.
/* exports.getToolsDataUsingMongoClient = asyncHandler(async (req, res, next) => {

    // Create a new MongoClient
    const client = new MongoClient(connUri, { useNewUrlParser: true, useUnifiedTopology: true });

    await client.connect();
    const db = client.db(dbName);

    // Access a collection
    const collection = db.collection('customers');

    // Query the collection or perform operations here
    const result = await collection.find({}).toArray();

    // Close the MongoDB connection
    client.close();

    res.status(200).json(result);
}); */

// Display all data.
exports.getToolsDataUsingMongoose = asyncHandler(async (req, res, next) => {
    const result = await Sheet.find({});

    res.status(200).json(result);
});

// Clear all data.
exports.clearCollection = asyncHandler(async (req, res, next) => {
    await Sheet.deleteMany({});

    res.status(200).json({ message: 'Collection cleared successfully' });
});

// Store constant data from app.constant.ts file.
exports.storeData = asyncHandler(async (req, res, next) => {
    const dataToInsert = req.body;

    // Use the insertMany function on your Mongoose model
    const result = await Sheet.insertMany(dataToInsert);

    console.log('Bulk insert successful:', result);

    res.status(200).json({ message: 'Bulk insert successful' });
});

// Display all data using Script code.
/* exports.getToolsScriptData = asyncHandler(async (req, res, next) => {

    var dataToSend;
    // spawn new child process to call the python script
    const pythonProcess = spawn('python3', [path.join(__dirname, '../dist', 'script1.py')]);

    // collect data from script
    pythonProcess.stdout.on('data', function (data) {
        console.log('Pipe data from python script ...');
        dataToSend = data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    // in close event we are sure that stream from child process is closed
    pythonProcess.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        // send data to browser
        res.status(200).json(dataToSend);
    });
}); */
