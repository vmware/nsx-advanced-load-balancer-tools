const express = require('express');
const path = require('path');
const cors = require('cors');
const toolsRouter = require("./app/routes/tools.route");
var mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection URL
const connUri = 'mongodb://localhost:27017/';

// Database name
const dbName = 'nsxAlbMigrationTools';

app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(connUri, {
  dbName: dbName,
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

// Serve static files from the 'dist' directory.
app.use(express.static(path.join(__dirname, '../nsx-alb-tools-angular-app', 'dist')));

// Route for serving the data asked by Angular application.
app.use("/migrationTools", toolsRouter);

// Route for serving the Angular application.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../nsx-alb-tools-angular-app/dist', 'index.html'));
});

// Error handling middleware.
app.use((err, req, res, next) => {
  console.error(err); // Log the error for debugging
  res.status(500).json({ error: 'Internal server error' }); // Respond to the client
});

// Start the server.
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
