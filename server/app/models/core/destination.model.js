const mongoose = require('mongoose');

const destinationSchema = mongoose.Schema({
    tenant: [String],
    cloud: [String],
    vrf: [String],
    seGroup: [String],
});

module.exports = mongoose.model('Destination', destinationSchema);
