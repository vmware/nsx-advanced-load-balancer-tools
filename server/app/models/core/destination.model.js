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

const aviDestinationDetailsSchema = mongoose.Schema({
    f5_host_ip: String,
    data: {
        avi_destination_ip: String,
        avi_destination_user: String,
        avi_destination_password: String,
        avi_destination_version: String,
        avi_mapped_vrf: String,
        avi_mapped_tenant: String,
        avi_mapped_cloud: String,
        avi_mapped_segroup: String,
    },
});

const AviDestinationMappingModel = mongoose.model('AviDestinationMappingModel', destinationMappingSchema);
const AviDestinationDetailsModel  = mongoose.model('AviDestinationDetailsModel', aviDestinationDetailsSchema);

module.exports = {
    AviDestinationMappingModel,
    AviDestinationDetailsModel,
}
