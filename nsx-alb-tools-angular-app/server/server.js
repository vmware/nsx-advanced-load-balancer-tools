const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, '..', 'dist')));

app.get('/button-click', (req, res) => {

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
});

// Route for serving the Angular application
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
