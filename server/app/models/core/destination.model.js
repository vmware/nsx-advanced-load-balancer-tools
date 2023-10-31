const mongoose = require('mongoose');

const destinationMappingSchema = mongoose.Schema({
    avi_destination_ip: String,
    tenants: [{
        tenant: String,
        clouds: [{
            cloud_name: String,
            vrf: [{ name: String }],
            seg: [{ name: String }],
        }]
    }],
});

const AviDestinationMappingModel = mongoose.model('AviDestinationMappingModel', destinationMappingSchema);

module.exports = {
    AviDestinationMappingModel,
}
