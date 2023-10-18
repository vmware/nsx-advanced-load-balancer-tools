const mongoose = require('mongoose');

const aviLabDetailsSchema = mongoose.Schema({
    avi_lab_ip: String,
    avi_lab_user: String,
    avi_lab_password: String,
});

const aviDestinationDetailsSchema = mongoose.Schema({
    avi_destination_ip: String,
    avi_destination_user: String,
    avi_destination_password: String,
    avi_destination_version: String,
    avi_mapped_vrf: String,
    avi_mapped_tenant: String,
    avi_mapped_cloud: String,
    avi_mapped_segroup: String,
});

const conversionStatusSchema = mongoose.Schema({
    status_sheet: [{
        "profile": Object,
        "monitor": Object,
        "pool": Object,
        "persistence": Object,
        "policy": Object,
        "virtual": Object,
        "data-group": Object,
        "virtual-address": Object,
        "node": Object,
    }],
    pivot_sheet: [{
        Status: String,
        F5_type: String,
        F5_SubType: String,
        len: Number,
    }]
});

const aviOutputSchema = mongoose.Schema({
    ApplicationProfile: Object,
    NetworkProfile: Object,
    SSLProfile: Object,
    PKIProfile: Object,
    SSLKeyAndCertificate: Object,
    ApplicationPersistenceProfile: Object,
    HealthMonitor: Object,
    IpAddrGroup: Object,
    StringGroup: Object,
    HTTPPolicySet: Object,
    VrfContext: Object,
    PoolGroup: Object,
    PriorityLabels: Object,
    Pool: Object,
    VirtualService: Object,
    VSDataScriptSet: Object,
    NetworkSecurityPolicy: Object,
    VsVip: Object,
    Tenant: Object,
});


const AviLabDetailsModel  = mongoose.model('AviLabDetailsModel', aviLabDetailsSchema);
const AviDestinationDetailsModel  = mongoose.model('AviDestinationDetailsModel', aviDestinationDetailsSchema);
const ConversionStatusModel  = mongoose.model('ConversionStatusModel', conversionStatusSchema);
const AviOutputModel  = mongoose.model('AviOutputModel', aviOutputSchema);


module.exports = {
    AviLabDetailsModel,
    AviDestinationDetailsModel,
    ConversionStatusModel,
    AviOutputModel,
}
